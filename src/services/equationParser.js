import { parse, compile, evaluate } from 'mathjs'
import { sanitizeInput } from '../utils/validators'

/**
 * Parses a mathematical equation string using Math.js
 * @param {string} input - Raw equation string
 * @returns {Object} - { success: boolean, data: ParsedNode | null, error: string | null }
 */
export const parseEquation = (input) => {
    try {
        const sanitized = sanitizeInput(input)

        // Replace common patterns for Math.js compatibility
        let processed = sanitized
            .replace(/\b(sin|cos|tan|sec|csc|cot|asin|acos|atan)\s*\^\s*(\d+)\s*\(\s*(.*?)\s*\)/g, '($1($3))^$2') // sin^2(x) -> (sin(x))^2
            .replace(/\^/g, '^')  // Power operator
            .replace(/e\s*\^/g, 'exp')  // e^x -> exp(x)
            .replace(/ln\s*\(/g, 'log(')  // Natural log
            .replace(/log10\s*\(/g, 'log10(')  // Base 10 log

        // Handle implicit equations (e.g. x^2 + y^2 = 9) by converting to equality check
        // but preserve simple assignments (e.g. y = x, z = x+y) and function definitions (e.g. f(x) = x^2)
        // Check if starts with simple var assignment (y=) or function def (f(x)=)
        const isAssignment = /^[a-z]\w*\s*=/i.test(processed) || /^[a-z]\w*\([a-z,]+\)\s*=/i.test(processed)

        if (processed.includes('=') && !isAssignment) {
            processed = processed.replace(/=(?!=)/g, '==') // Replace = with ==, avoid ===
        }

        const node = parse(processed)
        const compiled = compile(processed)  // compile() needs a string, not a node

        return {
            success: true,
            data: { node, compiled, original: input, processed },
            error: null
        }
    } catch (error) {
        return {
            success: false,
            data: null,
            error: `Parse error: ${error.message}`
        }
    }
}

/**
 * Evaluates an equation at a given x value
 * @param {Object} compiled - Compiled Math.js expression
 * @param {number} x - X value
 * @param {number} y - Y value (optional, for implicit equations)
 * @returns {number | null} - Result or null if error
 */
export const evaluateAt = (compiled, x, y = 0) => {
    try {
        const scope = { x, y, e: Math.E, pi: Math.PI }
        const result = compiled.evaluate(scope)

        // Check for invalid results
        if (typeof result !== 'number' || !isFinite(result)) {
            return null
        }

        return result
    } catch (error) {
        return null
    }
}

/**
 * Evaluates equation with custom scope (for parameters)
 * @param {Object} compiled - Compiled expression
 * @param {Object} scope - Variable scope { x, y, a, b, c, etc. }
 * @returns {number | null}
 */
export const evaluateWithScope = (compiled, scope) => {
    try {
        const fullScope = { ...scope, e: Math.E, pi: Math.PI }
        const result = compiled.evaluate(fullScope)

        if (typeof result !== 'number' || !isFinite(result)) {
            return null
        }

        return result
    } catch (error) {
        return null
    }
}

/**
 * Checks if equation is implicit (contains both x and y)
 * @param {string} equation - Equation string
 * @returns {boolean}
 */
export const isImplicitEquation = (equation) => {
    const hasX = /\bx\b/i.test(equation)
    const hasY = /\by\b/i.test(equation)
    return hasX && hasY
}

/**
 * Extracts variables from equation
 * @param {Object} node - Parsed Math.js node
 * @returns {Array} - Array of variable names
 */
export const extractVariables = (node) => {
    const variables = new Set()

    node.traverse((node) => {
        if (node.type === 'SymbolNode') {
            const name = node.name
            // Exclude constants
            if (!['e', 'pi', 'E', 'PI'].includes(name)) {
                variables.add(name)
            }
        }
    })

    return Array.from(variables)
}
