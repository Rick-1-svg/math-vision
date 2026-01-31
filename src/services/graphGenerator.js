import { EQUATION_TYPES } from '../utils/constants'
import { evaluateWithScope } from './equationParser'

/**
 * Generates graph data for Plotly.js
 * @param {Object} compiled - Compiled Math.js expression
 * @param {string} type - Equation type
 * @param {Array} parameters - Parameter values
 * @param {string} originalEquation - Original equation string
 * @returns {Object} - Plotly data and layout
 */
export const generateGraphData = (compiled, type, parameters = [], originalEquation = '') => {
    // Build parameter scope
    const paramScope = {}
    parameters.forEach(p => {
        paramScope[p.name] = p.value
    })

    let data = []
    let layout = getDefaultLayout(type, originalEquation)

    switch (type) {
        case EQUATION_TYPES.LINEAR:
        case EQUATION_TYPES.QUADRATIC:
        case EQUATION_TYPES.CUBIC:
        case EQUATION_TYPES.EXPONENTIAL:
        case EQUATION_TYPES.LOGARITHMIC:
            data = generateExplicitGraph(compiled, paramScope, type)
            break

        case EQUATION_TYPES.SINE:
        case EQUATION_TYPES.COSINE:
            data = generateTrigGraph(compiled, paramScope, type)
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
            data = generateExplicitGraph(compiled, paramScope, type)
    }

    return { data, layout }
}

/**
 * Generates data for explicit functions y = f(x)
 */
const generateExplicitGraph = (compiled, paramScope, type) => {
    const xRange = getXRange(type)
    const numPoints = 1000
    const step = (xRange.max - xRange.min) / numPoints

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const x = xRange.min + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }
        const y = evaluateWithScope(compiled, scope)

        if (y !== null && isFinite(y)) {
            xValues.push(x)
            yValues.push(y)
        }
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
        name: 'f(x)'
    }]
}

/**
 * Generates data for trigonometric functions
 */
const generateTrigGraph = (compiled, paramScope, type) => {
    const xMin = -2 * Math.PI
    const xMax = 2 * Math.PI
    const numPoints = 1000
    const step = (xMax - xMin) / numPoints

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }
        const y = evaluateWithScope(compiled, scope)

        if (y !== null && isFinite(y)) {
            xValues.push(x)
            yValues.push(y)
        }
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
        name: type === EQUATION_TYPES.SINE ? 'sin(x)' : 'cos(x)'
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

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        xValues.push(h + r * Math.cos(theta))
        yValues.push(k + r * Math.sin(theta))
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
        name: 'Circle'
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

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        xValues.push(h + a * Math.cos(theta))
        yValues.push(k + b * Math.sin(theta))
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
        name: 'Ellipse'
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
            showlegend: true
        },
        {
            x: xRight,
            y: yRightNeg,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            showlegend: false
        },
        {
            x: xLeft,
            y: yLeftPos,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            showlegend: false
        },
        {
            x: xLeft,
            y: yLeftNeg,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#2D5BFF', width: 3 },
            showlegend: false
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
 * Gets default Plotly layout
 */
const getDefaultLayout = (type, equation) => {
    const isDark = document.body.classList.contains('dark')

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
            color: isDark ? '#E8ECF5' : '#1A1A1A'
        },
        yaxis: {
            title: 'y',
            gridcolor: isDark ? '#2A3350' : '#E5E7EB',
            zerolinecolor: isDark ? '#4A5568' : '#9CA3AF',
            color: isDark ? '#E8ECF5' : '#1A1A1A'
        },
        plot_bgcolor: isDark ? '#0A0E27' : '#FFFFFF',
        paper_bgcolor: isDark ? '#141B3D' : '#FFFFFF',
        margin: { l: 60, r: 40, t: 60, b: 60 },
        hovermode: 'closest',
        showlegend: false
    }
}
