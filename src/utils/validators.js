/**
 * Validates equation input with strict constraints
 * - Prohibits ALL uppercase letters (A-Z)
 * - Prohibits ALL whitespace characters (including Unicode)
 * @param {string} input - User input equation
 * @returns {Object} - { valid: boolean, error: string, suggestion: string, corrected: string }
 */
export const isValidEquation = (input) => {
    // Empty check
    if (!input || input.trim() === '') {
        return {
            valid: false,
            error: 'Please enter an equation',
            suggestion: null,
            corrected: null
        }
    }

    // Length check
    if (input.length > 200) {
        return {
            valid: false,
            error: 'Equation too long (max 200 characters)',
            suggestion: null,
            corrected: null
        }
    }

    // Uppercase detection - STRICT: 100% rejection
    const uppercaseChars = input.match(/[A-Z]/g)
    if (uppercaseChars) {
        const uniqueChars = [...new Set(uppercaseChars)].join(', ')
        return {
            valid: false,
            error: `Uppercase letters not allowed. Found: ${uniqueChars}`,
            suggestion: 'Use lowercase only (e.g., sin(x), cos(x), log(x))',
            corrected: input.toLowerCase()
        }
    }

    // Whitespace detection - ZERO TOLERANCE (including Unicode whitespace)
    const whitespaceRegex = /[\s\u00A0\u200B\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/
    if (whitespaceRegex.test(input)) {
        const wsMatches = input.match(/\s/g) || []
        const unicodeWsMatches = input.match(/[\u00A0\u200B\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g) || []
        const totalWs = wsMatches.length + unicodeWsMatches.length

        return {
            valid: false,
            error: `Whitespace not allowed. Found ${totalWs} space character(s)`,
            suggestion: 'Remove all spaces (e.g., x^2+2*x not x^2 + 2*x)',
            corrected: input.replace(/[\s\u00A0\u200B\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g, '')
        }
    }

    // Character whitelist - lowercase only, no spaces
    const safePattern = /^[a-z0-9+\-*/^().,=]+$/
    if (!safePattern.test(input)) {
        return {
            valid: false,
            error: 'Invalid characters detected. Use only: a-z, 0-9, +, -, *, /, ^, (, ), =',
            suggestion: null,
            corrected: null
        }
    }

    // Multivariable detection - Allow both x and y for 3D surfaces
    const hasX = /x/.test(input)
    const hasY = /y/.test(input)
    const hasZ = /z/.test(input)

    // Variable presence check - must have at least one variable or be a constant (some consts are ok but generally we want vars)
    // Actually, simple constants like "5" are valid horizontal lines/planes.
    // But let's check basic variable logic.

    // If explicit z= is used, it is valid 3D
    if (/^z=/.test(input) || (hasX && hasY)) {
        // Valid 3D candidate
    } else if (!hasX && !hasY && !hasZ) {
        // Maybe just a number? Valid.
    }

    // Variable presence check - must have at least one variable
    if (!hasX && !hasY && !hasZ) {
        return {
            valid: false,
            error: 'Equation must contain variable x, y, or z',
            suggestion: 'Add a variable to your equation (e.g., x^2, sin(x), z=x+y)',
            corrected: null
        }
    }

    return { valid: true, error: null, suggestion: null, corrected: null }
}

/**
 * Sanitizes input by converting to lowercase and removing ALL whitespace
 * This is the auto-correction function
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized input (lowercase, no whitespace)
 */
export const sanitizeInput = (input) => {
    if (!input) return ''

    let sanitized = input

    // Convert to lowercase (handles uppercase letters)
    sanitized = sanitized.toLowerCase()

    // Remove ALL whitespace including Unicode variants
    sanitized = sanitized.replace(/[\s\u00A0\u200B\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g, '')

    // Remove script tags (security)
    sanitized = sanitized.replace(/<script>/gi, '')
    sanitized = sanitized.replace(/<\/script>/gi, '')

    return sanitized
}

/**
 * Validates parameter value
 * @param {number} value - Parameter value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - Whether value is valid
 */
export const isValidParameter = (value, min, max) => {
    if (typeof value !== 'number' || isNaN(value)) return false
    return value >= min && value <= max
}

/**
 * Checks if input has uppercase letters
 * @param {string} input - Input to check
 * @returns {boolean} - True if uppercase found
 */
export const hasUppercase = (input) => {
    return /[A-Z]/.test(input)
}

/**
 * Checks if input has whitespace
 * @param {string} input - Input to check
 * @returns {boolean} - True if whitespace found
 */
export const hasWhitespace = (input) => {
    return /[\s\u00A0\u200B\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/.test(input)
}

