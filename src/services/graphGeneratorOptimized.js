/**
 * Optimized Graph Generator Service
 * Uses efficient rendering strategies and supports adaptive sampling
 * @module services/graphGeneratorOptimized
 */

import { EQUATION_TYPES } from '../utils/constants'
import { evaluateWithScope } from './equationParser'

// Track last known axis ranges for adaptive sampling
let lastXRange = { min: -10, max: 10 }
let lastYRange = { min: -10, max: 10 }

/**
 * Updates the known axis ranges (called from relayout events)
 */
export const updateAxisRanges = (xRange, yRange) => {
    if (xRange) lastXRange = xRange
    if (yRange) lastYRange = yRange
}

/**
 * Gets the current axis ranges
 */
export const getAxisRanges = () => ({
    xRange: lastXRange,
    yRange: lastYRange
})

/**
 * Calculate optimal number of points based on viewport width
 * More points for wider views, fewer for narrow
 */
const getAdaptivePointCount = (xRange, containerWidth = 800) => {
    const range = xRange.max - xRange.min
    // Aim for ~2 points per pixel for smooth curves
    const idealPoints = Math.floor(containerWidth * 2)
    // Clamp between 500 and 2000 for performance
    return Math.max(500, Math.min(2000, idealPoints))
}

/**
 * Generates optimized graph data for Plotly.js
 * @param {Object} compiled - Compiled Math.js expression
 * @param {string} type - Equation type
 * @param {Array} parameters - Parameter values
 * @param {string} originalEquation - Original equation string
 * @param {Object} options - Additional options { useAdaptiveSampling, containerWidth }
 * @returns {Object} - Plotly data and layout
 */
export const generateGraphDataOptimized = (compiled, type, parameters = [], originalEquation = '', options = {}) => {
    const { useAdaptiveSampling = true, containerWidth = 800 } = options

    // Build parameter scope
    const paramScope = {}
    parameters.forEach(p => {
        paramScope[p.name] = p.value
    })

    // Determine point count
    const xRange = getXRange(type)
    const numPoints = useAdaptiveSampling
        ? getAdaptivePointCount(xRange, containerWidth)
        : 1000

    let data = []
    let layout = getDefaultLayout(type, originalEquation)

    switch (type) {
        case EQUATION_TYPES.LINEAR:
        case EQUATION_TYPES.QUADRATIC:
        case EQUATION_TYPES.CUBIC:
        case EQUATION_TYPES.EXPONENTIAL:
        case EQUATION_TYPES.LOGARITHMIC:
            data = generateExplicitGraph(compiled, paramScope, type, numPoints)
            break

        case EQUATION_TYPES.SINE:
        case EQUATION_TYPES.COSINE:
            data = generateTrigGraph(compiled, paramScope, type, numPoints)
            break

        case EQUATION_TYPES.CIRCLE:
            data = generateCircleGraph(paramScope)
            break

        case EQUATION_TYPES.ELLIPSE:
            data = generateEllipseGraph(paramScope)
            break

        case EQUATION_TYPES.HYPERBOLA:
            data = generateHyperbolaGraph(paramScope)
            break

        default:
            data = generateExplicitGraph(compiled, paramScope, type, numPoints)
    }

    return { data, layout }
}

/**
 * Generates data for explicit functions y = f(x)
 * Optimized with pre-allocated arrays
 */
const generateExplicitGraph = (compiled, paramScope, type, numPoints = 1000) => {
    const xRange = getXRange(type)
    const step = (xRange.max - xRange.min) / numPoints

    // Pre-allocate arrays for better performance
    const xValues = new Array(numPoints + 1)
    const yValues = new Array(numPoints + 1)
    let validCount = 0

    for (let i = 0; i <= numPoints; i++) {
        const x = xRange.min + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }
        const y = evaluateWithScope(compiled, scope)

        if (y !== null && isFinite(y)) {
            xValues[validCount] = x
            yValues[validCount] = y
            validCount++
        }
    }

    // Trim arrays to actual size
    xValues.length = validCount
    yValues.length = validCount

    return [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: '#2D5BFF',
            width: 3,
            shape: 'spline' // Smoother curves
        },
        name: 'f(x)',
        hoverinfo: 'x+y'
    }]
}

/**
 * Generates data for trigonometric functions
 */
const generateTrigGraph = (compiled, paramScope, type, numPoints = 1000) => {
    const xMin = -2 * Math.PI
    const xMax = 2 * Math.PI
    const step = (xMax - xMin) / numPoints

    const xValues = new Array(numPoints + 1)
    const yValues = new Array(numPoints + 1)
    let validCount = 0

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }
        const y = evaluateWithScope(compiled, scope)

        if (y !== null && isFinite(y)) {
            xValues[validCount] = x
            yValues[validCount] = y
            validCount++
        }
    }

    xValues.length = validCount
    yValues.length = validCount

    return [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: '#2D5BFF',
            width: 3,
            shape: 'spline'
        },
        name: type === EQUATION_TYPES.SINE ? 'sin(x)' : 'cos(x)',
        hoverinfo: 'x+y'
    }]
}

/**
 * Generates data for circle using parametric equations
 */
const generateCircleGraph = (paramScope) => {
    const r = paramScope.r || 5
    const h = paramScope.h || 0
    const k = paramScope.k || 0
    const numPoints = 500

    const xValues = new Array(numPoints + 1)
    const yValues = new Array(numPoints + 1)

    for (let i = 0; i <= numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        xValues[i] = h + r * Math.cos(theta)
        yValues[i] = k + r * Math.sin(theta)
    }

    return [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: '#2D5BFF',
            width: 3
        },
        fill: 'none',
        name: 'Circle',
        hoverinfo: 'x+y'
    }]
}

/**
 * Generates data for ellipse
 */
const generateEllipseGraph = (paramScope) => {
    const a = paramScope.a || 5
    const b = paramScope.b || 3
    const h = paramScope.h || 0
    const k = paramScope.k || 0
    const numPoints = 500

    const xValues = new Array(numPoints + 1)
    const yValues = new Array(numPoints + 1)

    for (let i = 0; i <= numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        xValues[i] = h + a * Math.cos(theta)
        yValues[i] = k + b * Math.sin(theta)
    }

    return [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: '#2D5BFF',
            width: 3
        },
        name: 'Ellipse',
        hoverinfo: 'x+y'
    }]
}

/**
 * Generates data for hyperbola
 */
const generateHyperbolaGraph = (paramScope) => {
    const a = paramScope.a || 3
    const b = paramScope.b || 2
    const numPoints = 500

    // Right branch
    const xRight = []
    const yRightPos = []
    const yRightNeg = []

    for (let i = 0; i <= numPoints; i++) {
        const x = a + (i / numPoints) * 10
        const ySquared = (b * b) * ((x * x) / (a * a) - 1)
        if (ySquared >= 0) {
            const y = Math.sqrt(ySquared)
            xRight.push(x)
            yRightPos.push(y)
            yRightNeg.push(-y)
        }
    }

    // Left branch
    const xLeft = []
    const yLeftPos = []
    const yLeftNeg = []

    for (let i = 0; i <= numPoints; i++) {
        const x = -a - (i / numPoints) * 10
        const ySquared = (b * b) * ((x * x) / (a * a) - 1)
        if (ySquared >= 0) {
            const y = Math.sqrt(ySquared)
            xLeft.push(x)
            yLeftPos.push(y)
            yLeftNeg.push(-y)
        }
    }

    return [
        {
            x: xRight,
            y: yRightPos,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            name: 'Hyperbola',
            showlegend: true,
            hoverinfo: 'x+y'
        },
        {
            x: xRight,
            y: yRightNeg,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            showlegend: false,
            hoverinfo: 'x+y'
        },
        {
            x: xLeft,
            y: yLeftPos,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            showlegend: false,
            hoverinfo: 'x+y'
        },
        {
            x: xLeft,
            y: yLeftNeg,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            showlegend: false,
            hoverinfo: 'x+y'
        }
    ]
}

/**
 * Gets appropriate x-range for equation type
 */
const getXRange = (type) => {
    switch (type) {
        case EQUATION_TYPES.LOGARITHMIC:
            return { min: 0.1, max: 10 }
        case EQUATION_TYPES.EXPONENTIAL:
            return { min: -5, max: 5 }
        case EQUATION_TYPES.SINE:
        case EQUATION_TYPES.COSINE:
            return { min: -2 * Math.PI, max: 2 * Math.PI }
        default:
            return { min: -10, max: 10 }
    }
}

/**
 * Gets default Plotly layout with optimized settings
 */
const getDefaultLayout = (type, equation) => {
    const isDark = document.body.classList.contains('dark')

    if (type === EQUATION_TYPES.THREE_D) {
        return {
            title: {
                text: equation,
                font: {
                    family: 'JetBrains Mono, monospace',
                    size: 16,
                    color: isDark ? '#E8ECF5' : '#1A1A1A'
                }
            },
            scene: {
                xaxis: {
                    title: 'x',
                    gridcolor: isDark ? '#2A3350' : '#E5E7EB',
                    zerolinecolor: isDark ? '#4A5568' : '#9CA3AF',
                    color: isDark ? '#E8ECF5' : '#1A1A1A',
                    showbackground: true,
                    backgroundcolor: isDark ? '#0A0E27' : '#FFFFFF'
                },
                yaxis: {
                    title: 'y',
                    gridcolor: isDark ? '#2A3350' : '#E5E7EB',
                    zerolinecolor: isDark ? '#4A5568' : '#9CA3AF',
                    color: isDark ? '#E8ECF5' : '#1A1A1A',
                    showbackground: true,
                    backgroundcolor: isDark ? '#0A0E27' : '#FFFFFF'
                },
                zaxis: {
                    title: 'z',
                    gridcolor: isDark ? '#2A3350' : '#E5E7EB',
                    zerolinecolor: isDark ? '#4A5568' : '#9CA3AF',
                    color: isDark ? '#E8ECF5' : '#1A1A1A',
                    showbackground: true,
                    backgroundcolor: isDark ? '#0A0E27' : '#FFFFFF'
                },
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            },
            paper_bgcolor: isDark ? '#141B3D' : '#FFFFFF',
            margin: { l: 0, r: 0, t: 40, b: 0 },
            showlegend: false,
            uirevision: 'true' // Preserve rotation
        }
    }

    return {
        title: {
            text: equation,
            font: {
                family: 'JetBrains Mono, monospace',
                size: 16,
                color: isDark ? '#E8ECF5' : '#1A1A1A'
            }
        },
        xaxis: {
            title: 'x',
            gridcolor: isDark ? '#2A3350' : '#E5E7EB',
            zerolinecolor: isDark ? '#4A5568' : '#9CA3AF',
            color: isDark ? '#E8ECF5' : '#1A1A1A',
            // Enable range slider for easy navigation
            rangeslider: { visible: false },
            showspikes: true,
            spikethickness: 1,
            spikedash: 'dot',
            spikecolor: isDark ? '#4A5568' : '#9CA3AF',
            spikemode: 'across'
        },
        yaxis: {
            title: 'y',
            gridcolor: isDark ? '#2A3350' : '#E5E7EB',
            zerolinecolor: isDark ? '#4A5568' : '#9CA3AF',
            color: isDark ? '#E8ECF5' : '#1A1A1A',
            scaleanchor: type === EQUATION_TYPES.CIRCLE || type === EQUATION_TYPES.ELLIPSE ? 'x' : undefined,
            scaleratio: type === EQUATION_TYPES.CIRCLE ? 1 : undefined,
            showspikes: true,
            spikethickness: 1,
            spikedash: 'dot',
            spikecolor: isDark ? '#4A5568' : '#9CA3AF',
            spikemode: 'across'
        },
        plot_bgcolor: isDark ? '#0A0E27' : '#FFFFFF',
        paper_bgcolor: isDark ? '#141B3D' : '#FFFFFF',
        margin: { l: 60, r: 40, t: 60, b: 60 },
        hovermode: 'closest',
        showlegend: false,
        // Performance optimizations
        uirevision: 'true', // Preserve UI state across updates
        dragmode: 'pan', // Enable panning by default
        transition: {
            duration: 0 // Disable transitions for faster updates
        }
    }
}

// Export helpers individually
export { getDefaultLayout, getXRange }

export default {
    generateGraphDataOptimized,
    updateAxisRanges,
    getAxisRanges,
    getXRange,
    getDefaultLayout
}
