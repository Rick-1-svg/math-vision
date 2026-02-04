import { compile } from 'mathjs'
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

    // Strategy 1: Check for explicit 3D (z = ...)
    if (variables.includes('z') || /^z=/.test(normalized)) {
        return EQUATION_TYPES.THREE_D
    }

    // Strategy 2: Check for Implicit 2D (Conics) - Requires Equality
    if (normalized.includes('=')) {
        if (isCircle(normalized)) return EQUATION_TYPES.CIRCLE
        if (isEllipse(normalized)) return EQUATION_TYPES.ELLIPSE
        if (isHyperbola(normalized)) return EQUATION_TYPES.HYPERBOLA
    }

    // Strategy 3: Check for Implicit 3D Surface (f(x,y) with NO equality or z)
    // If we have x and y, and it's NOT a conic with =, it's likely a surface z = f(x,y)
    // Note: If it matched a conic regex but had no '=', it falls here (e.g. x^2 + y^2 - 25)
    // which is correct for a surface.
    if (variables.includes('x') && variables.includes('y')) {
        return EQUATION_TYPES.THREE_D
    }

    // Strategy 4: One Variable (x only, or constant)
    // Check specific 1D function types
    if (/sin\(/.test(normalized)) return EQUATION_TYPES.SINE
    if (/cos\(/.test(normalized)) return EQUATION_TYPES.COSINE
    if (/tan\(/.test(normalized)) return EQUATION_TYPES.TANGENT
    if (/exp\(|e\^/.test(normalized) || /\d*\*?e\^/.test(normalized)) return EQUATION_TYPES.EXPONENTIAL
    if (/log\(|ln\(/.test(normalized)) return EQUATION_TYPES.LOGARITHMIC

    // Strategy 5: Polynomial Degree Check
    // We check degree by inspecting the string or node. Regex is simple for x^n.
    if (/x\^3/.test(normalized)) return EQUATION_TYPES.CUBIC
    if (/x\^2/.test(normalized)) return EQUATION_TYPES.QUADRATIC

    // Linear: contains x, does not contain x^
    if (/\bx\b/.test(normalized) && !/x\^/.test(normalized)) {
        return EQUATION_TYPES.LINEAR
    }

    return EQUATION_TYPES.UNKNOWN
}

// --- Classification Helpers ---

const isCircle = (normalized) => {
    // x^2 + y^2 = r^2
    return /x\^2.*\+.*y\^2/.test(normalized) && !normalized.includes('/')
}

const isEllipse = (normalized) => {
    // x^2/a + y^2/b = 1
    return /(?:x\^2|\(x\^2\))\/.*\+.*(?:y\^2|\(y\^2\))\//.test(normalized)
}

const isHyperbola = (normalized) => {
    // x^2/a - y^2/b = 1
    return /(?:x\^2|\(x\^2\))\/.*-.*(?:y\^2|\(y\^2\))\//.test(normalized)
}


/**
 * Extracts parameters from equation based on its type
 * @param {string} equation - Equation string
 * @param {string} type - Equation type
 * @returns {Array} - Array of parameter objects
 */
export const extractParameters = (equation, type) => {
    // Use the factory pattern to delegate extraction
    const extractor = PARAMETER_EXTRACTORS[type]
    if (extractor) {
        return extractor(equation)
    }
    return []
}

// --- Extraction Strategies ---

const extractLinearParams = (equation) => {
    // y = mx + b
    // Robust Numerical Extraction:
    // b = f(0)
    // m = f(1) - f(0)
    try {
        const f = compileExpression(equation)
        if (f) {
            const b = f(0)
            const m = f(1) - b
            return [
                { name: 'm', label: 'Slope (m)', value: m, min: -10, max: 10, step: 0.1, default: 1 },
                { name: 'b', label: 'Y-intercept (b)', value: b, min: -10, max: 10, step: 0.1, default: 0 }
            ]
        }
    } catch (e) { /* fallback to regex */ }

    // Fallback Regex
    return [
        { name: 'm', label: 'Slope (m)', value: extractCoef(equation, /(-?\d*\.?\d*)\*?x/), min: -10, max: 10, step: 0.1, default: 1 },
        { name: 'b', label: 'Y-intercept (b)', value: extractCoef(equation, /[+-]\s*(\d+\.?\d*)(?!\*x)/, 0), min: -10, max: 10, step: 0.1, default: 0 }
    ]
}

const extractQuadraticParams = (equation) => {
    // ax^2 + bx + c
    // c = f(0)
    // a+b = f(1)-c
    // a-b = f(-1)-c
    try {
        const f = compileExpression(equation)
        if (f) {
            const c = f(0)
            const sumAB = f(1) - c
            const subAB = f(-1) - c
            const a = (sumAB + subAB) / 2
            const b = (sumAB - subAB) / 2

            return [
                { name: 'a', label: 'Coefficient a', value: a, min: -10, max: 10, step: 0.1, default: 1 },
                { name: 'b', label: 'Coefficient b', value: b, min: -10, max: 10, step: 0.1, default: 0 },
                { name: 'c', label: 'Constant c', value: c, min: -10, max: 10, step: 0.1, default: 0 }
            ]
        }
    } catch (e) { /* fallback */ }

    return [
        { name: 'a', label: 'Coefficient a', value: extractCoef(equation, /(-?\d*\.?\d*)\*?x\^2/), min: -10, max: 10, step: 0.1, default: 1 },
        { name: 'b', label: 'Coefficient b', value: extractCoef(equation, /[+-]\s*(-?\d*\.?\d*)\*?x(?!\^)/, 0), min: -10, max: 10, step: 0.1, default: 0 },
        { name: 'c', label: 'Constant c', value: extractCoef(equation, /[+-]\s*(\d+\.?\d*)$/, 0), min: -10, max: 10, step: 0.1, default: 0 }
    ]
}

const extractCubicParams = (equation) => {
    // ax^3 + bx^2 + cx + d
    // Regex fallback for now as Cubic is less strictly verified
    return [
        { name: 'a', label: 'Coefficient a', value: extractCoef(equation, /(-?\d*\.?\d*)\*?x\^3/), min: -5, max: 5, step: 0.1, default: 1 }
    ]
}

const extractCircleParams = (equation) => {
    const rSquared = extractCoef(equation, /=\s*(\d+\.?\d*)/)
    return [{ name: 'r', label: 'Radius (r)', value: Math.sqrt(Math.abs(rSquared)), min: 0.5, max: 15, step: 0.5, default: 5 }]
}

const extractConicParams = (equation, type) => {
    const aSquared = extractCoef(equation, /(?:x\^2|\(x\^2\))\/(\d+\.?\d*)/)
    const bSquared = extractCoef(equation, /(?:y\^2|\(y\^2\))\/(\d+\.?\d*)/)
    return [
        { name: 'a', label: 'Semi-major axis (a)', value: Math.sqrt(Math.abs(aSquared)), min: 0.5, max: 10, step: 0.1, default: 3 },
        { name: 'b', label: 'Semi-minor axis (b)', value: Math.sqrt(Math.abs(bSquared)), min: 0.5, max: 10, step: 0.1, default: 2 }
    ]
}

const extractTrigParams = (equation, type) => {
    let funcName = 'sin'
    if (type === EQUATION_TYPES.COSINE) funcName = 'cos'
    if (type === EQUATION_TYPES.TANGENT) funcName = 'tan'

    return [
        { name: 'a', label: 'Amplitude (a)', value: extractCoef(equation, new RegExp(`(-?\\d*\\.?\\d*)\\*?${funcName}`)), min: -5, max: 5, step: 0.1, default: 1 },
        { name: 'b', label: 'Frequency (b)', value: extractCoef(equation, new RegExp(`${funcName}\\((-?\\d*\\.?\\d*)\\*?x`)), min: 0.1, max: 5, step: 0.1, default: 1 }
    ]
}

const extractExpLogParams = (equation, type) => {
    const isExp = type === EQUATION_TYPES.EXPONENTIAL
    const pattern = isExp ? /(-?\d*\.?\d*)\*?(?:exp|e\^)/ : /(-?\d*\.?\d*)\*?(?:log|ln)/
    return [{ name: 'a', label: 'Coefficient (a)', value: extractCoef(equation, pattern), min: -5, max: 5, step: 0.1, default: 1 }]
}


const PARAMETER_EXTRACTORS = {
    [EQUATION_TYPES.LINEAR]: extractLinearParams,
    [EQUATION_TYPES.QUADRATIC]: extractQuadraticParams,
    [EQUATION_TYPES.CUBIC]: extractCubicParams,
    [EQUATION_TYPES.CIRCLE]: extractCircleParams,
    [EQUATION_TYPES.ELLIPSE]: (eq) => extractConicParams(eq, EQUATION_TYPES.ELLIPSE),
    [EQUATION_TYPES.HYPERBOLA]: (eq) => extractConicParams(eq, EQUATION_TYPES.HYPERBOLA),
    [EQUATION_TYPES.SINE]: (eq) => extractTrigParams(eq, EQUATION_TYPES.SINE),
    [EQUATION_TYPES.COSINE]: (eq) => extractTrigParams(eq, EQUATION_TYPES.COSINE),
    [EQUATION_TYPES.TANGENT]: (eq) => extractTrigParams(eq, EQUATION_TYPES.TANGENT),
    [EQUATION_TYPES.EXPONENTIAL]: (eq) => extractExpLogParams(eq, EQUATION_TYPES.EXPONENTIAL),
    [EQUATION_TYPES.LOGARITHMIC]: (eq) => extractExpLogParams(eq, EQUATION_TYPES.LOGARITHMIC)
}

// --- Helpers ---

/**
 * Extracts a numeric coefficient matching a pattern
 */
const extractCoef = (equation, pattern, defaultValue = 1) => {
    const match = equation.match(pattern)
    if (match) {
        let valStr = match[1] ? match[1].replace(/\s/g, '') : ''
        if (valStr === '' || valStr === '+') return 1
        if (valStr === '-') return -1

        const coef = parseFloat(valStr)
        return isNaN(coef) ? defaultValue : coef
    }
    return defaultValue
}

/**
 * Compiles equation for numerical evaluation
 * Returns a function f(x) or null
 */
const compileExpression = (equation) => {
    try {
        // Ensure equation is an expression, not assignment
        // If it contains '=', numerical eval is hard without solving
        if (equation.includes('=')) return null

        const compiled = compile(equation)
        return (x) => {
            const scope = { x, e: Math.E, pi: Math.PI }
            return compiled.evaluate(scope)
        }
    } catch (e) { return null }
}
