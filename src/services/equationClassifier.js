import { EQUATION_TYPES } from '../utils/constants'
import { extractVariables } from './equationParser'

/**
 * Classifies equation type based on its structure
 * @param {string} equation - Equation string
 * @param {Object} parsedNode - Parsed Math.js node
 * @returns {string} - Equation type from EQUATION_TYPES
 */
export const classifyEquation = (equation, parsedNode) => {
    const normalized = equation.toLowerCase().replace(/\s/g, '')
    const variables = extractVariables(parsedNode)

    // Check for explicit 3D (z = ...) or implicit f(x,y)
    if (variables.includes('z') || /^z=/.test(normalized)) {
        return EQUATION_TYPES.THREE_D
    }

    // Check for multivariable function f(x, y) without equality, assuming z = ...
    // But exclude implicit 2D equations like circles
    if (variables.includes('x') && variables.includes('y') && !normalized.includes('=')) {
        return EQUATION_TYPES.THREE_D
    }

    // Check for trigonometric functions
    if (/sin\(/.test(normalized)) return EQUATION_TYPES.SINE
    if (/cos\(/.test(normalized)) return EQUATION_TYPES.COSINE
    if (/tan\(/.test(normalized)) return EQUATION_TYPES.TANGENT

    // Check for exponential
    if (/exp\(|e\^/.test(normalized)) return EQUATION_TYPES.EXPONENTIAL
    if (/\d*\*?e\^/.test(normalized)) return EQUATION_TYPES.EXPONENTIAL

    // Check for logarithmic
    if (/log\(|ln\(/.test(normalized)) return EQUATION_TYPES.LOGARITHMIC

    // Check for implicit equations (circle, ellipse, hyperbola)
    if (variables.includes('x') && variables.includes('y')) {
        // Circle: x^2 + y^2 = r^2 or x^2 + y^2 - r^2 = 0
        if (/x\^2.*\+.*y\^2/.test(normalized) && !normalized.includes('/')) {
            return EQUATION_TYPES.CIRCLE
        }

        // Ellipse: x^2/a^2 + y^2/b^2 = 1 or (x^2)/a + (y^2)/b - 1
        if (/(?:x\^2|\(x\^2\))\/.*\+.*(?:y\^2|\(y\^2\))\//.test(normalized)) {
            return EQUATION_TYPES.ELLIPSE
        }

        // Hyperbola: x^2/a^2 - y^2/b^2 = 1 or (x^2)/a - (y^2)/b - 1
        if (/(?:x\^2|\(x\^2\))\/.*-.*(?:y\^2|\(y\^2\))\//.test(normalized)) {
            return EQUATION_TYPES.HYPERBOLA
        }
    }

    // Check polynomial degree for x-only equations
    if (variables.includes('x') && !variables.includes('y')) {
        // Cubic: x^3
        if (/x\^3/.test(normalized)) return EQUATION_TYPES.CUBIC

        // Quadratic: x^2
        if (/x\^2/.test(normalized)) return EQUATION_TYPES.QUADRATIC

        // Linear: just x
        if (/\bx\b/.test(normalized) && !/x\^/.test(normalized)) {
            return EQUATION_TYPES.LINEAR
        }
    }

    return EQUATION_TYPES.UNKNOWN
}

/**
 * Extracts parameters from equation based on its type
 * @param {string} equation - Equation string
 * @param {string} type - Equation type
 * @returns {Array} - Array of parameter objects
 */
export const extractParameters = (equation, type) => {
    const params = []

    // Extract numeric coefficients
    const extractCoefficient = (pattern, defaultValue = 1) => {
        const match = equation.match(pattern)
        if (match) {
            const coef = match[1] ? parseFloat(match[1]) : defaultValue
            return isNaN(coef) ? defaultValue : coef
        }
        return defaultValue
    }

    switch (type) {
        case EQUATION_TYPES.LINEAR:
            // ... (omitted linear case lines 92-113 as they are unchanged)
            // y = mx + b or ax + b
            params.push({
                name: 'm',
                label: 'Slope (m)',
                value: extractCoefficient(/(-?\d*\.?\d*)\*?x/),
                min: -10,
                max: 10,
                step: 0.1,
                default: 1
            })
            params.push({
                name: 'b',
                label: 'Y-intercept (b)',
                value: extractCoefficient(/[+-]\s*(\d+\.?\d*)(?!\*x)/),
                min: -10,
                max: 10,
                step: 0.1,
                default: 0
            })
            break

        case EQUATION_TYPES.QUADRATIC:
            // ax^2 + bx + c
            params.push({
                name: 'a',
                label: 'Coefficient a',
                value: extractCoefficient(/(-?\d*\.?\d*)\*?x\^2/),
                min: -10,
                max: 10,
                step: 0.1,
                default: 1
            })
            params.push({
                name: 'b',
                label: 'Coefficient b',
                value: extractCoefficient(/[+-]\s*(-?\d*\.?\d*)\*?x(?!\^)/),
                min: -10,
                max: 10,
                step: 0.1,
                default: 0
            })
            params.push({
                name: 'c',
                label: 'Constant c',
                value: extractCoefficient(/[+-]\s*(\d+\.?\d*)$/),
                min: -10,
                max: 10,
                step: 0.1,
                default: 0
            })
            break

        case EQUATION_TYPES.CUBIC:
            // ... (omitted cubic case lines 145-156)
            // ax^3 + bx^2 + cx + d
            params.push({
                name: 'a',
                label: 'Coefficient a',
                value: extractCoefficient(/(-?\d*\.?\d*)\*?x\^3/),
                min: -5,
                max: 5,
                step: 0.1,
                default: 1
            })
            break

        case EQUATION_TYPES.CIRCLE:
            // x^2 + y^2 = r^2
            const rSquared = extractCoefficient(/=\s*(\d+\.?\d*)/)
            params.push({
                name: 'r',
                label: 'Radius (r)',
                value: Math.sqrt(Math.abs(rSquared)),
                min: 0.5,
                max: 15,
                step: 0.5,
                default: 5
            })
            break

        case EQUATION_TYPES.ELLIPSE:
        case EQUATION_TYPES.HYPERBOLA:
            // x^2/a^2 +/- y^2/b^2 = 1
            // Also supports (x^2)/a^2 ...
            const aSquared = extractCoefficient(/(?:x\^2|\(x\^2\))\/(\d+\.?\d*)/)
            const bSquared = extractCoefficient(/(?:y\^2|\(y\^2\))\/(\d+\.?\d*)/)
            params.push({
                name: 'a',
                label: 'Semi-major axis (a)',
                value: Math.sqrt(Math.abs(aSquared)),
                min: 0.5,
                max: 10,
                step: 0.1,
                default: 3
            })
            params.push({
                name: 'b',
                label: 'Semi-minor axis (b)',
                value: Math.sqrt(Math.abs(bSquared)),
                min: 0.5,
                max: 10,
                step: 0.1,
                default: 2
            })
            break

        case EQUATION_TYPES.SINE:
        case EQUATION_TYPES.COSINE:
        case EQUATION_TYPES.TANGENT:
            // a*func(bx + c) + d
            let funcName = 'sin'
            if (type === EQUATION_TYPES.COSINE) funcName = 'cos'
            if (type === EQUATION_TYPES.TANGENT) funcName = 'tan'

            params.push({
                name: 'a',
                label: 'Amplitude (a)',
                value: extractCoefficient(new RegExp(`(-?\\d*\\.?\\d*)\\*?${funcName}`)),
                min: -5,
                max: 5,
                step: 0.1,
                default: 1
            })
            params.push({
                name: 'b',
                label: 'Frequency (b)',
                value: extractCoefficient(new RegExp(`${funcName}\\((-?\\d*\\.?\\d*)\\*?x`)),
                min: 0.1,
                max: 5,
                step: 0.1,
                default: 1
            })
            break

        case EQUATION_TYPES.EXPONENTIAL:
            // a*e^(bx)
            params.push({
                name: 'a',
                label: 'Coefficient (a)',
                value: extractCoefficient(/(-?\d*\.?\d*)\*?(?:exp|e\^)/),
                min: -5,
                max: 5,
                step: 0.1,
                default: 1
            })
            break

        case EQUATION_TYPES.LOGARITHMIC:
            // a*log(x)
            params.push({
                name: 'a',
                label: 'Coefficient (a)',
                value: extractCoefficient(/(-?\d*\.?\d*)\*?(?:log|ln)/),
                min: -5,
                max: 5,
                step: 0.1,
                default: 1
            })
            break
    }

    return params
}
