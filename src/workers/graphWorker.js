/**
 * Graph Calculation Web Worker
 * Offloads heavy math computations from the main thread
 * @module workers/graphWorker
 */

import { create, all } from 'mathjs'

// Create a mathjs instance for this worker
const math = create(all)

// Alias functions that might be missing or named differently
math.import({
    ln: math.log,
    cosec: math.csc
})

// Message handler
self.onmessage = function (e) {
    const { type, payload, requestId } = e.data

    try {
        let result
        switch (type) {
            case 'GENERATE_EXPLICIT':
                result = generateExplicitData(payload)
                break
            case 'GENERATE_TRIG':
                result = generateTrigData(payload)
                break
            case 'GENERATE_CIRCLE':
                result = generateCircleData(payload)
                break
            case 'GENERATE_ELLIPSE':
                result = generateEllipseData(payload)
                break
            case 'GENERATE_HYPERBOLA':
                result = generateHyperbolaData(payload)
                break
            case 'GENERATE_3D':
                result = generate3DData(payload)
                break
            case 'GENERATE_DERIVATIVE':
                result = generateDerivativeData(payload)
                break
            case 'GENERATE_INTEGRAL_SHAPE':
                result = generateIntegralShape(payload)
                break
            case 'FIND_ROOTS':
                result = findRoots(payload)
                break
            default:
                result = generateExplicitData(payload)
        }

        self.postMessage({
            success: true,
            requestId,
            data: result
        })
    } catch (error) {
        self.postMessage({
            success: false,
            requestId,
            error: error.message
        })
    }
}

/**
 * Generate numerical derivative data f'(x)
 */
function generateDerivativeData({ expression, paramScope, xRange, numPoints = 1000 }) {
    const compiled = math.compile(expression)
    const step = (xRange.max - xRange.min) / numPoints
    const h = 0.001 // Small step for differentiation

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const x = xRange.min + i * step
        const scopePlus = { ...paramScope, x: x + h, e: Math.E, pi: Math.PI }
        const scopeMinus = { ...paramScope, x: x - h, e: Math.E, pi: Math.PI }

        try {
            const yPlus = compiled.evaluate(scopePlus)
            const yMinus = compiled.evaluate(scopeMinus)

            if (isFinite(yPlus) && isFinite(yMinus)) {
                const derivative = (yPlus - yMinus) / (2 * h)
                xValues.push(x)
                yValues.push(derivative)
            }
        } catch {
            // Skip
        }
    }

    return { xValues, yValues }
}

/**
 * Generate integral shape data (polygon)
 */
function generateIntegralShape({ expression, paramScope, range, resolution = 200 }) {
    const compiled = math.compile(expression)
    const step = (range.max - range.min) / resolution

    // Start at (min, 0)
    const xValues = [range.min]
    const yValues = [0]

    let sumArea = 0

    for (let i = 0; i <= resolution; i++) {
        const x = range.min + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }
        try {
            const y = compiled.evaluate(scope)
            if (isFinite(y)) {
                xValues.push(x)
                yValues.push(y)
                // Riemann sum approx for area calculation (optional return)
                if (i > 0) sumArea += y * step
            }
        } catch {
            // Skip
        }
    }

    // Close the loop at (max, 0)
    xValues.push(range.max)
    yValues.push(0)
    // And back to start? Plotly "tozeroy" fill handles it mostly, but closed polygon is safer
    xValues.push(range.min)
    yValues.push(0)

    return { xValues, yValues, area: sumArea }
}

/**
 * Find roots (x-intercepts)
 */
function findRoots({ expression, paramScope, xRange, resolution = 200 }) {
    const compiled = math.compile(expression)
    const step = (xRange.max - xRange.min) / resolution
    const roots = []

    let prevY = null
    let prevX = null

    for (let i = 0; i <= resolution; i++) {
        const x = xRange.min + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }
        try {
            const y = compiled.evaluate(scope)

            if (prevY !== null && isFinite(y) && isFinite(prevY)) {
                // Sign change detection
                if (Math.sign(y) !== Math.sign(prevY) && Math.abs(y - prevY) < 10) { // Check for asymptote jumps
                    // Linear interpolation for better precision
                    const slope = (y - prevY) / (x - prevX)
                    const exactX = prevX - prevY / slope
                    roots.push({ x: exactX, y: 0 })
                }
                // Check for exact zero
                else if (Math.abs(y) < 1e-10) {
                    roots.push({ x, y: 0 })
                }
            }
            prevX = x
            prevY = y
        } catch {
            prevY = null
        }
    }

    return { roots }
}

/**
 * Generate 3D surface data z = f(x,y)
 */
function generate3DData({ expression, paramScope, xRange, yRange, resolution = 75 }) {
    // Sanitize expression: implicit z= removal
    let expr = expression
    if (expr.trim().toLowerCase().startsWith('z=')) {
        expr = expr.substring(expr.indexOf('=') + 1)
    }
    // Also handle z = ... by just creating regular expression if possible

    const compiled = math.compile(expr)

    // Arrays for Plotly surface
    // x: 1D array
    // y: 1D array
    // z: 2D array (y rows, x columns)

    const xStep = (xRange.max - xRange.min) / resolution
    const yStep = (yRange.max - yRange.min) / resolution

    const xValues = []
    const yValues = []
    const zValues = []

    // Populate xValues and yValues
    for (let c = 0; c <= resolution; c++) {
        xValues.push(xRange.min + c * xStep)
    }
    for (let r = 0; r <= resolution; r++) {
        yValues.push(yRange.min + r * yStep)
    }

    // Populate Z matrix (row by row)
    for (let r = 0; r <= resolution; r++) {
        const row = []
        const y = yValues[r]
        for (let c = 0; c <= resolution; c++) {
            const x = xValues[c]
            const scope = { ...paramScope, x, y, e: Math.E, pi: Math.PI }
            try {
                let z = compiled.evaluate(scope)
                // Strict Domain Validation: Filter complex numbers
                if (z !== null && typeof z === 'object' && 're' in z) {
                    // Check if imaginary part is significant
                    if (Math.abs(z.im) > 1e-10) {
                        z = null // Undefined in real domain
                    } else {
                        z = z.re // Use real part if imaginary is negligible
                    }
                }

                if (z === null || !isFinite(z) || isNaN(z)) {
                    row.push(null)
                } else {
                    row.push(z)
                }
            } catch {
                row.push(null)
            }
        }
        zValues.push(row)
    }

    return { xValues, yValues, zValues }
}

/**
 * Generate data for explicit functions y = f(x)
 */
function generateExplicitData({ expression, paramScope, xRange, numPoints = 1000 }) {
    const compiled = math.compile(expression)
    const step = (xRange.max - xRange.min) / numPoints

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const x = xRange.min + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }

        try {
            const y = compiled.evaluate(scope)
            if (y !== null && isFinite(y) && !isNaN(y)) {
                xValues.push(x)
                yValues.push(y)
            }
        } catch {
            // Skip invalid points
        }
    }

    return { xValues, yValues }
}

/**
 * Generate data for trigonometric functions
 */
function generateTrigData({ expression, paramScope, xRange, numPoints = 1000 }) {
    const compiled = math.compile(expression)
    const xMin = xRange ? xRange.min : -2 * Math.PI
    const xMax = xRange ? xRange.max : 2 * Math.PI
    const step = (xMax - xMin) / numPoints

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step
        const scope = { ...paramScope, x, e: Math.E, pi: Math.PI }

        try {
            const y = compiled.evaluate(scope)
            if (y !== null && isFinite(y) && !isNaN(y)) {
                xValues.push(x)
                yValues.push(y)
            }
        } catch {
            // Skip invalid points
        }
    }

    return { xValues, yValues }
}

/**
 * Generate circle data using parametric equations
 */
function generateCircleData({ paramScope, numPoints = 500 }) {
    const r = paramScope.r || 5
    const h = paramScope.h || 0
    const k = paramScope.k || 0

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        xValues.push(h + r * Math.cos(theta))
        yValues.push(k + r * Math.sin(theta))
    }

    return { xValues, yValues }
}

/**
 * Generate ellipse data
 */
function generateEllipseData({ paramScope, numPoints = 500 }) {
    const a = paramScope.a || 5
    const b = paramScope.b || 3
    const h = paramScope.h || 0
    const k = paramScope.k || 0

    const xValues = []
    const yValues = []

    for (let i = 0; i <= numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        xValues.push(h + a * Math.cos(theta))
        yValues.push(k + b * Math.sin(theta))
    }

    return { xValues, yValues }
}

/**
 * Generate hyperbola data
 */
function generateHyperbolaData({ paramScope, numPoints = 500 }) {
    const a = paramScope.a || 3
    const b = paramScope.b || 2

    const traces = []

    // Right branch - positive y
    let xRight = [], yRightPos = [], yRightNeg = []
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
    traces.push({ xValues: xRight, yValues: yRightPos })
    traces.push({ xValues: xRight, yValues: yRightNeg })

    // Left branch
    let xLeft = [], yLeftPos = [], yLeftNeg = []
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
    traces.push({ xValues: xLeft, yValues: yLeftPos })
    traces.push({ xValues: xLeft, yValues: yLeftNeg })

    return { traces }
}
