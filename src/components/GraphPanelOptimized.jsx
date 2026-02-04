import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Plotly from 'plotly.js-dist-min'
import { parseEquation } from '../services/equationParser'
import { classifyEquation } from '../services/equationClassifier'
import { generateGraphDataOptimized, updateAxisRanges, getDefaultLayout, getXRange } from '../services/graphGeneratorOptimized'
import { useGraphWorker } from '../hooks/useGraphWorker'

/**
 * Optimized GraphPanel Component
 * Uses Plotly.react for efficient updates and supports adaptive rendering
 */
const GraphPanelOptimized = ({ equation, parameters, equations }) => {
    const graphRef = useRef(null)
    const containerRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'))
    const [isInitialized, setIsInitialized] = useState(false)
    const [viewRange, setViewRange] = useState(null)
    const relayoutTimeoutRef = useRef(null)
    // Store latest range to handle partial updates
    const rangeRef = useRef({ min: -10, max: 10 })

    // Track previous values to determine update type
    const prevDataRef = useRef(null)

    // Memoize parsed equation data
    const parsedData = useMemo(() => {
        if (!equation) return null

        try {
            const parsed = parseEquation(equation)
            if (!parsed.success) {
                return { error: parsed.error }
            }

            const type = classifyEquation(equation, parsed.data.node)
            return {
                parsed,
                type,
                compiled: parsed.data.compiled
            }
        } catch (err) {
            return { error: err.message }
        }
    }, [equation])

    // Listen for theme changes
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(document.body.classList.contains('dark'))
                }
            })
        })

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [])

    // Handle relayout events to track axis ranges
    const handleRelayout = useCallback((eventData) => {
        if (relayoutTimeoutRef.current) clearTimeout(relayoutTimeoutRef.current)

        // Reset viewRange on autorange
        if (eventData['xaxis.autorange'] === true || eventData['yaxis.autorange'] === true) {
            setViewRange(null)
            return
        }

        let newXRange = null

        // helper to extract range
        if (eventData['xaxis.range[0]'] !== undefined) {
            newXRange = { min: eventData['xaxis.range[0]'], max: eventData['xaxis.range[1]'] }
        } else if (eventData['xaxis.range'] && Array.isArray(eventData['xaxis.range'])) {
            newXRange = { min: eventData['xaxis.range'][0], max: eventData['xaxis.range'][1] }
        }

        if (newXRange) {
            rangeRef.current = newXRange

            // Debounce update to avoid excessive re-renders during drag
            relayoutTimeoutRef.current = setTimeout(() => {
                setViewRange(newXRange)
            }, 100)
        }
    }, [])

    // Get container width for adaptive sampling
    const getContainerWidth = useCallback(() => {
        return containerRef.current?.clientWidth || 800
    }, [])

    // Generate graph configuration
    const getConfig = useCallback(() => ({
        responsive: true,
        displayModeBar: true,
        // Remove requested buttons: Zoom and Reset Camera
        modeBarButtonsToRemove: [
            'lasso2d', 'select2d',
            'zoom2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d',
            'resetScale2d', 'resetCameraDefault3d', 'resetCameraLastSave3d'
        ],
        displaylogo: false,
        scrollZoom: true,
        toImageButtonOptions: {
            format: 'png',
            filename: 'math_graph',
            height: 800,
            width: 1200,
            scale: 2
        }
    }), [])

    // Use the custom worker hook
    const { generateData: generateWorkerData, loading: workerLoading, error: workerError } = useGraphWorker()

    // Combined loading/error state
    const isLoading = loading || workerLoading
    const displayError = error || workerError

    // Helper to construct Plotly traces from worker data
    const constructTraces = useCallback((workerResult, type) => {
        const createTrace = (x, y, name, override = {}) => ({
            x, y,
            type: 'scatter',
            mode: 'lines',
            line: {
                color: '#2D5BFF',
                width: 3,
                shape: 'spline'
            },
            name,
            hoverinfo: 'x+y',
            ...override
        })

        if (workerResult.traces) {
            // Hyperbola or multi-trace result
            return workerResult.traces.map((t, i) => createTrace(
                t.xValues,
                t.yValues,
                i === 0 ? 'Hyperbola' : '',
                { showlegend: i === 0 }
            ))
        }

        const { xValues, yValues, zValues } = workerResult

        switch (type) {
            case 'CIRCLE':
                return [createTrace(xValues, yValues, 'Circle', { fill: 'none' })]
            case 'ELLIPSE':
                return [createTrace(xValues, yValues, 'Ellipse')]
            case 'SINE':
            case 'COSINE':
                return [createTrace(xValues, yValues, type === 'SINE' ? 'sin(x)' : 'cos(x)')]
            case 'three_d': // Matches constant value
                return [{
                    type: 'surface',
                    x: xValues,
                    y: yValues,
                    z: zValues,
                    colorscale: isDarkMode ? 'Viridis' : 'Plasma',
                    showscale: false,
                    contours: {
                        z: { show: true, usecolormap: true, highlightcolor: "#42f462", project: { z: true } }
                    }
                }]
            default:
                return [createTrace(xValues, yValues, 'f(x)')]
        }
    }, [isDarkMode])

    // Initial render or full re-render
    const renderGraph = useCallback(async () => {
        if (!graphRef.current) return

        // Handle legacy props (single equation)
        const activeEquations = equations || (equation ? [{
            id: 'legacy',
            text: equation,
            // classify if not provided, but worker handles it mostly by trying generic or specific
            // For now, let's assume legacy flow uses parsedData logic we had, but we are moving to worker.
            // Actually, for consistency, let's normalize to array
            type: parsedData?.type || 'GENERAL',
            parameters: parameters || [],
            visible: true,
            color: '#2D5BFF'
        }] : [])

        const validEquations = activeEquations.filter(eq => eq.visible && !eq.error && eq.text)

        if (validEquations.length === 0) {
            // clear graph
            if (isInitialized) {
                Plotly.purge(graphRef.current)
                setIsInitialized(false)
            }
            return
        }

        setLoading(true)
        setError(null)

        try {
            const allTraces = []

            // Create promises for all equation generation
            const promises = validEquations.map(async (eq) => {
                const defaultX = getXRange(eq.type)
                const xRange = viewRange || defaultX
                const yRange = { min: -10, max: 10 } // Default Y range for 3D

                const paramScope = {}
                eq.parameters.forEach(p => { paramScope[p.name] = p.value })

                let commandType = 'GENERATE_EXPLICIT'
                if (['SINE', 'COSINE'].includes(eq.type)) commandType = 'GENERATE_TRIG'
                else if (eq.type === 'CIRCLE') commandType = 'GENERATE_CIRCLE'
                else if (eq.type === 'ELLIPSE') commandType = 'GENERATE_ELLIPSE'
                else if (eq.type === 'HYPERBOLA') commandType = 'GENERATE_HYPERBOLA'
                else if (eq.type === 'three_d') commandType = 'GENERATE_3D'

                const equationTraces = []

                try {
                    // 1. Generate Main Graph
                    const result = await generateWorkerData(commandType, {
                        expression: eq.text,
                        paramScope,
                        xRange,
                        yRange,
                        numPoints: 1000
                    })

                    const mainTraces = constructTraces(result, eq.type)
                    if (eq.type !== 'three_d') {
                        mainTraces.forEach(t => t.line.color = eq.color || '#2D5BFF')
                    }
                    equationTraces.push(...mainTraces)

                    // 2. Calculus Features (Only for 2D Explicit)
                    if (eq.type !== 'three_d' && eq.features) {
                        // Derivative
                        if (eq.features.showDerivative) {
                            const dResult = await generateWorkerData('GENERATE_DERIVATIVE', {
                                expression: eq.text,
                                paramScope,
                                xRange,
                                numPoints: 500
                            })
                            equationTraces.push({
                                x: dResult.xValues,
                                y: dResult.yValues,
                                type: 'scatter',
                                mode: 'lines',
                                line: { color: eq.color, width: 2, dash: 'dash' },
                                name: `d/dx ${eq.text}`,
                                opacity: 0.7
                            })
                        }

                        // Integral Area
                        if (eq.features.showIntegral) {
                            const iResult = await generateWorkerData('GENERATE_INTEGRAL_SHAPE', {
                                expression: eq.text,
                                paramScope,
                                range: eq.features.integralRange,
                                resolution: 200
                            })
                            equationTraces.unshift({ // Add to beginning (render behind)
                                x: iResult.xValues,
                                y: iResult.yValues,
                                type: 'scatter',
                                mode: 'lines',
                                fill: 'toself',
                                fillcolor: `${eq.color}33`, // Low opacity hex
                                line: { width: 0 },
                                name: `Area [${eq.features.integralRange.min}, ${eq.features.integralRange.max}]`,
                                hoverinfo: 'none'
                            })
                        }

                        // Roots
                        if (eq.features.showRoots) {
                            const rResult = await generateWorkerData('FIND_ROOTS', {
                                expression: eq.text,
                                paramScope,
                                xRange: { min: -20, max: 20 }, // Check wider range
                                resolution: 500
                            })
                            if (rResult.roots && rResult.roots.length > 0) {
                                equationTraces.push({
                                    x: rResult.roots.map(r => r.x),
                                    y: rResult.roots.map(r => r.y),
                                    type: 'scatter',
                                    mode: 'markers',
                                    marker: { symbol: 'x', size: 10, color: eq.color },
                                    name: 'Roots',
                                    hoverinfo: 'x'
                                })
                            }
                        }
                    }

                    return equationTraces

                } catch (e) {
                    console.error(`Failed to generate graph for ${eq.text}`, e)
                    return []
                }
            })

            const results = await Promise.all(promises)
            results.forEach(traces => allTraces.push(...traces))

            // Check if we have any 3D plots
            const is3D = validEquations.some(eq => eq.type === 'three_d')
            const layoutType = is3D ? 'three_d' : (validEquations[0]?.type || 'GENERAL')
            const layout = getDefaultLayout(layoutType, is3D ? '3D View' : '2D View')

            // Apply theme-specific overrides
            const themedLayout = {
                ...layout,
                showlegend: validEquations.length > 1 && !is3D
            }
            if (!is3D) {
                Object.assign(themedLayout, getThemeLayout(isDarkMode))
            }

            const config = getConfig()

            // Detect mode change (2D <-> 3D)
            const modeChanged = prevDataRef.current?.is3D !== is3D

            if (!isInitialized || modeChanged) {
                if (modeChanged && graphRef.current) {
                    try {
                        Plotly.purge(graphRef.current)
                    } catch (e) {
                        console.warn('Purge failed', e)
                    }
                }
                await Plotly.newPlot(graphRef.current, allTraces, themedLayout, config)
                graphRef.current.on('plotly_relayout', handleRelayout)
                setIsInitialized(true)
            } else {
                await Plotly.react(graphRef.current, allTraces, themedLayout, config)
            }

            prevDataRef.current = { data: allTraces, layout: themedLayout, is3D }
            setLoading(false)

        } catch (err) {
            console.error('Graph rendering error:', err)
            setError('Failed to render graph: ' + err.message)
            setLoading(false)
        }
    }, [equations, equation, parameters, parsedData, isDarkMode, isInitialized, getContainerWidth, getConfig, handleRelayout, generateWorkerData, constructTraces, viewRange])

    // Effect for equation/parameter changes
    useEffect(() => {
        if (equation || (equations && equations.length > 0)) {
            renderGraph()
        } else {
            setIsInitialized(false)
            prevDataRef.current = null
        }
    }, [equation, parameters, equations, renderGraph])

    // Effect for theme changes only - use relayout for minimal update
    useEffect(() => {
        if (!graphRef.current || !isInitialized || !equation) return

        try {
            const themeUpdate = getThemeLayout(isDarkMode)
            Plotly.relayout(graphRef.current, themeUpdate)
        } catch (err) {
            console.error('Theme update error:', err)
        }
    }, [isDarkMode, isInitialized, equation])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (graphRef.current) {
                try {
                    Plotly.purge(graphRef.current)
                } catch {
                    // Already cleaned up
                }
            }
        }
    }, [])

    const handleReset = useCallback(() => {
        if (!graphRef.current) return

        const is3D = prevDataRef.current?.is3D

        if (is3D) {
            Plotly.relayout(graphRef.current, {
                'scene.camera': {
                    up: { x: 0, y: 0, z: 1 },
                    center: { x: 0, y: 0, z: 0 },
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            })
        } else {
            Plotly.relayout(graphRef.current, {
                'xaxis.autorange': true,
                'yaxis.autorange': true
            })
        }
    }, [])

    const handleZoomIn = useCallback(() => {
        if (!graphRef.current) return

        const is3D = prevDataRef.current?.is3D

        if (is3D) {
            const currentEye = graphRef.current.layout.scene?.camera?.eye || { x: 1.5, y: 1.5, z: 1.5 }
            Plotly.relayout(graphRef.current, {
                'scene.camera.eye': {
                    x: currentEye.x * 0.8,
                    y: currentEye.y * 0.8,
                    z: currentEye.z * 0.8
                }
            })
            return
        }

        if (graphRef.current.layout) {
            const xaxis = graphRef.current.layout.xaxis
            const yaxis = graphRef.current.layout.yaxis
            const xRange = xaxis.range || [-10, 10]
            const yRange = yaxis.range || [-10, 10]
            const xCenter = (xRange[0] + xRange[1]) / 2
            const yCenter = (yRange[0] + yRange[1]) / 2
            const xSpan = (xRange[1] - xRange[0]) * 0.4
            const ySpan = (yRange[1] - yRange[0]) * 0.4

            Plotly.relayout(graphRef.current, {
                'xaxis.range': [xCenter - xSpan, xCenter + xSpan],
                'yaxis.range': [yCenter - ySpan, yCenter + ySpan]
            })
        }
    }, [])

    const handleZoomOut = useCallback(() => {
        if (!graphRef.current) return

        const is3D = prevDataRef.current?.is3D

        if (is3D) {
            const currentEye = graphRef.current.layout.scene?.camera?.eye || { x: 1.5, y: 1.5, z: 1.5 }
            Plotly.relayout(graphRef.current, {
                'scene.camera.eye': {
                    x: currentEye.x * 1.25,
                    y: currentEye.y * 1.25,
                    z: currentEye.z * 1.25
                }
            })
            return
        }

        if (graphRef.current.layout) {
            const xaxis = graphRef.current.layout.xaxis
            const yaxis = graphRef.current.layout.yaxis
            const xRange = xaxis.range || [-10, 10]
            const yRange = yaxis.range || [-10, 10]
            const xCenter = (xRange[0] + xRange[1]) / 2
            const yCenter = (yRange[0] + yRange[1]) / 2
            const xSpan = (xRange[1] - xRange[0]) * 0.8
            const ySpan = (yRange[1] - yRange[0]) * 0.8

            Plotly.relayout(graphRef.current, {
                'xaxis.range': [xCenter - xSpan, xCenter + xSpan],
                'yaxis.range': [yCenter - ySpan, yCenter + ySpan]
            })
        }
    }, [])

    const hasActiveEquation = equation || (equations && equations.some(eq => eq.text))

    if (!hasActiveEquation) {
        return (
            <div className="glass-card rounded-3xl p-8 min-h-[500px] flex items-center justify-center animate-fade-in">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-24 h-24 mx-auto mb-4 opacity-50 animate-pulse-slow">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 gradient-text">No Equation Yet</h3>
                    <p className="text-sm">Enter an equation above or select a preset to visualize</p>
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="glass-card rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold gradient-text flex items-center gap-2">
                    <span>📊</span>
                    <span>Graph Visualization</span>
                    {isDarkMode && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg font-normal">
                            Dark Theme
                        </span>
                    )}
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-lg font-normal">
                        Optimized
                    </span>
                </h3>
                <div className="flex gap-2">
                    {/* Zoom Out */}
                    <button
                        onClick={handleZoomOut}
                        className="p-3 rounded-2xl glass-button group relative overflow-hidden"
                        title="Zoom Out"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity"></div>
                        <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                        </svg>
                    </button>
                    {/* Zoom In */}
                    <button
                        onClick={handleZoomIn}
                        className="p-3 rounded-2xl glass-button group relative overflow-hidden"
                        title="Zoom In"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity"></div>
                        <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                    </button>
                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        className="p-3 rounded-2xl glass-button group relative overflow-hidden"
                        title="Fit to Screen"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity"></div>
                        <svg className="w-5 h-5 relative transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative min-h-[500px]">
                {displayError && (
                    <div className="absolute inset-0 z-20 glass-card bg-red-50/95 dark:bg-red-900/90 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-center animate-shake backdrop-blur-sm">
                        <div className="text-center text-red-600 dark:text-red-400">
                            <svg className="w-16 h-16 mx-auto mb-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="font-semibold text-lg max-w-md px-4">{displayError}</p>
                        </div>
                    </div>
                )}

                {isLoading && !isInitialized && (
                    <div className="absolute inset-0 z-10 glass-card bg-white/80 dark:bg-[#0A0E27]/80 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                        <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin"></div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">Rendering graph...</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg inline-block">
                                {equation}
                            </p>
                        </div>
                    </div>
                )}

                <div
                    ref={graphRef}
                    className="rounded-2xl min-h-[500px] w-full overflow-hidden shadow-inner transition-all duration-300"
                />
            </div>
        </div>
    )
}

// Helper function to get theme-specific layout
const getThemeLayout = (isDark) => ({
    'title.font.color': isDark ? '#E8ECF5' : '#1A1A1A',
    'xaxis.gridcolor': isDark ? '#2A3350' : '#E5E7EB',
    'xaxis.zerolinecolor': isDark ? '#4A5568' : '#9CA3AF',
    'xaxis.color': isDark ? '#E8ECF5' : '#1A1A1A',
    'yaxis.gridcolor': isDark ? '#2A3350' : '#E5E7EB',
    'yaxis.zerolinecolor': isDark ? '#4A5568' : '#9CA3AF',
    'yaxis.color': isDark ? '#E8ECF5' : '#1A1A1A',
    'plot_bgcolor': isDark ? '#0A0E27' : '#FFFFFF',
    'paper_bgcolor': isDark ? '#141B3D' : '#FFFFFF',
    'hoverlabel.bgcolor': isDark ? '#1F2937' : '#FFFFFF',
    'hoverlabel.bordercolor': isDark ? '#4B5563' : '#D1D5DB',
    'hoverlabel.font.color': isDark ? '#F3F4F6' : '#111827',
    'legend.bgcolor': isDark ? 'rgba(20, 27, 61, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    'legend.bordercolor': isDark ? '#4B5563' : '#D1D5DB',
    'legend.font.color': isDark ? '#E8ECF5' : '#1A1A1A'
})

export default React.memo(GraphPanelOptimized, (prevProps, nextProps) => {
    // Custom comparison for deep equality on equations if needed,
    // but usually shallow compare on equations array is enough IF we treat it immutably.
    // However, if we edit parameters in place, shallow compare might fail to detect changes?
    // useEquationManager sets new state array on update, so reference changes.
    // So default shallow compare should work for equations array ref change.

    // Check if simple props distinct
    if (prevProps.equation !== nextProps.equation) return false
    if (prevProps.parameters !== nextProps.parameters) return false

    // Check equations array
    if (prevProps.equations !== nextProps.equations) return false

    return true
})
