import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist-min'
import { parseEquation } from '../services/equationParser'
import { classifyEquation } from '../services/equationClassifier'
import { generateGraphData } from '../services/graphGenerator'

const GraphPanel = ({ equation, parameters }) => {
    const graphRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'))

    // Listen for theme changes
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const newIsDark = document.body.classList.contains('dark')
                    setIsDarkMode(newIsDark)
                }
            })
        })

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [])

    // Update graph theme when dark mode changes
    useEffect(() => {
        if (!graphRef.current || !equation) return

        // Skip if we're currently loading (graph not initialized yet)
        if (loading) return

        // Check if Plotly graph exists on the element
        const hasPlotlyGraph = graphRef.current && graphRef.current.data
        if (!hasPlotlyGraph) return

        const updateTheme = () => {
            try {
                const layout = getThemeLayout(isDarkMode, equation)
                Plotly.relayout(graphRef.current, layout)
            } catch (err) {
                console.error('Theme update error:', err)
            }
        }

        updateTheme()
    }, [isDarkMode, equation, loading])

    useEffect(() => {
        if (!equation || !graphRef.current) return

        const renderGraph = async () => {
            setLoading(true)
            setError(null)

            try {
                // Parse equation
                const parsed = parseEquation(equation)
                if (!parsed.success) {
                    setError(parsed.error)
                    setLoading(false)
                    return
                }

                // Classify equation type
                const type = classifyEquation(equation, parsed.data.node)

                // Generate graph data
                const { data, layout } = generateGraphData(
                    parsed.data.compiled,
                    type,
                    parameters,
                    equation
                )

                // Render with Plotly
                const config = {
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    displaylogo: false,
                    toImageButtonOptions: {
                        format: 'png',
                        filename: 'math_graph',
                        height: 800,
                        width: 1200,
                        scale: 2
                    }
                }

                await Plotly.newPlot(graphRef.current, data, layout, config)
                setLoading(false)
            } catch (err) {
                console.error('Graph rendering error:', err)
                setError('Failed to render graph: ' + err.message)
                setLoading(false)
            }
        }

        renderGraph()
    }, [equation, parameters])

    const handleReset = () => {
        if (graphRef.current) {
            Plotly.relayout(graphRef.current, {
                'xaxis.autorange': true,
                'yaxis.autorange': true
            })
        }
    }

    if (!equation) {
        return (
            <div className="glass-card rounded-3xl p-8 min-h-[500px] flex items-center justify-center animate-fade-in hover-lift">
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
        <div className="glass-card rounded-3xl p-6 animate-slide-up hover-lift">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold gradient-text flex items-center gap-2">
                    <span>📊</span>
                    <span>Graph Visualization</span>
                    {isDarkMode && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg font-normal">
                            Dark Theme
                        </span>
                    )}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="p-3 rounded-2xl glass-button group relative overflow-hidden"
                        title="Reset View"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <svg className="w-5 h-5 relative transform group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative min-h-[500px]">
                {error && (
                    <div className="absolute inset-0 z-20 glass-card bg-red-50/95 dark:bg-red-900/90 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-center animate-shake backdrop-blur-sm">
                        <div className="text-center text-red-600 dark:text-red-400">
                            <svg className="w-16 h-16 mx-auto mb-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="font-semibold text-lg max-w-md px-4">{error}</p>
                        </div>
                    </div>
                )}

                {loading && (
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
const getThemeLayout = (isDark, equation) => {
    return {
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
    }
}

export default GraphPanel
