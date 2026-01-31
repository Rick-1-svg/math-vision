/**
 * Step-by-Step Solution Generator
 * Generates educational step-by-step solutions for mathematical equations
 * @module services/solutionGenerator
 */

import { EQUATION_TYPES } from '../utils/constants'

/**
 * Generates step-by-step solution for an equation
 * @param {string} type - Equation type from EQUATION_TYPES
 * @param {Array} parameters - Parameter values
 * @param {string} equation - Original equation string
 * @returns {Object} - { title, steps: Array<{ step, explanation, formula }> }
 */
export const generateSolution = (type, parameters, equation) => {
    const paramMap = {}
    // Handle null/undefined parameters safely
    if (parameters && Array.isArray(parameters)) {
        parameters.forEach(p => {
            if (p && p.name !== undefined) {
                paramMap[p.name] = p.value
            }
        })
    }

    try {
        switch (type) {
            case EQUATION_TYPES.LINEAR:
                return generateLinearSolution(paramMap, equation)
            case EQUATION_TYPES.QUADRATIC:
                return generateQuadraticSolution(paramMap, equation)
            case EQUATION_TYPES.CUBIC:
                return generateCubicSolution(paramMap, equation)
            case EQUATION_TYPES.CIRCLE:
                return generateCircleSolution(paramMap, equation)
            case EQUATION_TYPES.ELLIPSE:
                return generateEllipseSolution(paramMap, equation)
            case EQUATION_TYPES.HYPERBOLA:
                return generateHyperbolaSolution(paramMap, equation)
            case EQUATION_TYPES.EXPONENTIAL:
                return generateExponentialSolution(paramMap, equation)
            case EQUATION_TYPES.LOGARITHMIC:
                return generateLogarithmicSolution(paramMap, equation)
            case EQUATION_TYPES.SINE:
            case EQUATION_TYPES.COSINE:
                return generateTrigSolution(type, paramMap, equation)
            default:
                return {
                    title: 'Equation Analysis',
                    steps: [{
                        step: 'Equation recognized',
                        explanation: 'This equation type requires manual analysis.',
                        formula: equation
                    }]
                }
        }
    } catch (error) {
        console.error('Solution generation error:', error)
        return {
            title: 'Solution Error',
            steps: [{
                step: 'Unable to generate solution',
                explanation: error.message || 'An error occurred while generating the solution.',
                formula: equation
            }]
        }
    }
}

/**
 * Generates solution for linear equation: y = mx + b
 */
const generateLinearSolution = ({ m = 1, b = 0 }, equation) => {
    const xIntercept = m !== 0 ? -b / m : 'undefined'
    const angle = Math.atan(m) * (180 / Math.PI)

    return {
        title: 'Linear Equation Solution',
        steps: [
            {
                step: 'Identify the equation form',
                explanation: 'A linear equation has the form y = mx + b, where m is the slope and b is the y-intercept.',
                formula: 'y = mx + b'
            },
            {
                step: 'Extract the slope (m)',
                explanation: `The slope m determines how steep the line is. Here, m = ${m.toFixed(2)}.`,
                formula: `m = ${m.toFixed(2)}`
            },
            {
                step: 'Extract the y-intercept (b)',
                explanation: `The y-intercept b is where the line crosses the y-axis. Here, b = ${b.toFixed(2)}.`,
                formula: `b = ${b.toFixed(2)}`
            },
            {
                step: 'Find the x-intercept',
                explanation: 'Set y = 0 and solve for x: 0 = mx + b → x = -b/m',
                formula: `x-intercept = ${typeof xIntercept === 'number' ? xIntercept.toFixed(2) : xIntercept}`
            },
            {
                step: 'Determine the angle with x-axis',
                explanation: 'The angle θ = arctan(m)',
                formula: `θ = ${angle.toFixed(2)}°`
            },
            {
                step: 'Interpret the slope',
                explanation: m > 0
                    ? 'Since m > 0, the line rises from left to right (increasing).'
                    : m < 0
                        ? 'Since m < 0, the line falls from left to right (decreasing).'
                        : 'Since m = 0, the line is horizontal.',
                formula: `Direction: ${m > 0 ? 'Increasing ↗' : m < 0 ? 'Decreasing ↘' : 'Horizontal →'}`
            }
        ]
    }
}

/**
 * Generates solution for quadratic equation: y = ax² + bx + c
 */
const generateQuadraticSolution = ({ a = 1, b = 0, c = 0 }, equation) => {
    const discriminant = b * b - 4 * a * c
    const h = -b / (2 * a)
    const k = a * h * h + b * h + c

    let rootsExplanation, rootsFormula
    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        rootsExplanation = 'Since D > 0, there are two distinct real roots.'
        rootsFormula = `x₁ = ${root1.toFixed(2)}, x₂ = ${root2.toFixed(2)}`
    } else if (discriminant === 0) {
        const root = -b / (2 * a)
        rootsExplanation = 'Since D = 0, there is exactly one real root (double root).'
        rootsFormula = `x = ${root.toFixed(2)} (double root)`
    } else {
        rootsExplanation = 'Since D < 0, there are no real roots (complex roots only).'
        rootsFormula = 'No real solutions'
    }

    return {
        title: 'Quadratic Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'A quadratic equation has the form y = ax² + bx + c, where a ≠ 0.',
                formula: 'y = ax² + bx + c'
            },
            {
                step: 'Extract coefficients',
                explanation: `Identify a, b, and c from your equation.`,
                formula: `a = ${a.toFixed(2)}, b = ${b.toFixed(2)}, c = ${c.toFixed(2)}`
            },
            {
                step: 'Calculate the discriminant',
                explanation: 'The discriminant D = b² - 4ac determines the nature of roots.',
                formula: `D = (${b.toFixed(2)})² - 4(${a.toFixed(2)})(${c.toFixed(2)}) = ${discriminant.toFixed(2)}`
            },
            {
                step: 'Find the roots using quadratic formula',
                explanation: rootsExplanation,
                formula: rootsFormula
            },
            {
                step: 'Find the vertex',
                explanation: 'The vertex (h, k) is at h = -b/(2a) and k = f(h).',
                formula: `Vertex = (${h.toFixed(2)}, ${k.toFixed(2)})`
            },
            {
                step: 'Determine the axis of symmetry',
                explanation: 'The parabola is symmetric about the vertical line x = h.',
                formula: `x = ${h.toFixed(2)}`
            },
            {
                step: 'Determine opening direction',
                explanation: a > 0
                    ? 'Since a > 0, the parabola opens upward (vertex is minimum).'
                    : 'Since a < 0, the parabola opens downward (vertex is maximum).',
                formula: `Opens ${a > 0 ? 'upward ⌣' : 'downward ⌢'}`
            },
            {
                step: 'Find the y-intercept',
                explanation: 'The y-intercept is the value of y when x = 0, which is c.',
                formula: `y-intercept = ${c.toFixed(2)}`
            }
        ]
    }
}

/**
 * Generates solution for cubic equation: y = ax³ + bx² + cx + d
 */
const generateCubicSolution = ({ a = 1, b = 0, c = 0, d = 0 }, equation) => {
    const inflectionX = -b / (3 * a)
    const inflectionY = a * Math.pow(inflectionX, 3) + b * Math.pow(inflectionX, 2) + c * inflectionX + d

    return {
        title: 'Cubic Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'A cubic equation has the form y = ax³ + bx² + cx + d.',
                formula: 'y = ax³ + bx² + cx + d'
            },
            {
                step: 'Extract coefficients',
                explanation: 'Identify the coefficients from your equation.',
                formula: `a = ${a.toFixed(2)}, b = ${b.toFixed(2)}, c = ${c.toFixed(2)}, d = ${d.toFixed(2)}`
            },
            {
                step: 'Find the inflection point',
                explanation: 'The inflection point is where the curve changes concavity. x = -b/(3a)',
                formula: `Inflection point = (${inflectionX.toFixed(2)}, ${inflectionY.toFixed(2)})`
            },
            {
                step: 'Determine end behavior',
                explanation: a > 0
                    ? 'Since a > 0: as x → -∞, y → -∞ and as x → +∞, y → +∞'
                    : 'Since a < 0: as x → -∞, y → +∞ and as x → +∞, y → -∞',
                formula: a > 0 ? 'Falls left ↙, Rises right ↗' : 'Rises left ↖, Falls right ↘'
            },
            {
                step: 'Find the y-intercept',
                explanation: 'The y-intercept is the value when x = 0.',
                formula: `y-intercept = ${d.toFixed(2)}`
            }
        ]
    }
}

/**
 * Generates solution for circle: x² + y² = r²
 */
const generateCircleSolution = ({ r = 5, h = 0, k = 0 }, equation) => {
    const circumference = 2 * Math.PI * r
    const area = Math.PI * r * r

    return {
        title: 'Circle Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'A circle has the form (x - h)² + (y - k)² = r², where (h, k) is the center.',
                formula: '(x - h)² + (y - k)² = r²'
            },
            {
                step: 'Find the center',
                explanation: 'The center (h, k) is the point from which all points are equidistant.',
                formula: `Center = (${h.toFixed(2)}, ${k.toFixed(2)})`
            },
            {
                step: 'Find the radius',
                explanation: 'The radius r is the distance from the center to any point on the circle.',
                formula: `Radius = ${r.toFixed(2)}`
            },
            {
                step: 'Calculate the diameter',
                explanation: 'The diameter is twice the radius: d = 2r',
                formula: `Diameter = ${(2 * r).toFixed(2)}`
            },
            {
                step: 'Calculate the circumference',
                explanation: 'The circumference is C = 2πr',
                formula: `Circumference = 2π(${r.toFixed(2)}) = ${circumference.toFixed(2)}`
            },
            {
                step: 'Calculate the area',
                explanation: 'The area is A = πr²',
                formula: `Area = π(${r.toFixed(2)})² = ${area.toFixed(2)}`
            }
        ]
    }
}

/**
 * Generates solution for ellipse: x²/a² + y²/b² = 1
 */
const generateEllipseSolution = ({ a = 5, b = 3, h = 0, k = 0 }, equation) => {
    const c = Math.sqrt(Math.abs(a * a - b * b))
    const eccentricity = c / Math.max(a, b)
    const area = Math.PI * a * b

    return {
        title: 'Ellipse Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'An ellipse has the form (x-h)²/a² + (y-k)²/b² = 1',
                formula: '(x-h)²/a² + (y-k)²/b² = 1'
            },
            {
                step: 'Find the center',
                explanation: 'The center is at (h, k).',
                formula: `Center = (${h.toFixed(2)}, ${k.toFixed(2)})`
            },
            {
                step: 'Find the semi-axes',
                explanation: 'a and b are the semi-major and semi-minor axes.',
                formula: `a = ${a.toFixed(2)}, b = ${b.toFixed(2)}`
            },
            {
                step: 'Calculate the focal distance',
                explanation: 'c = √(a² - b²) for a > b (horizontal ellipse)',
                formula: `c = √(${a.toFixed(2)}² - ${b.toFixed(2)}²) = ${c.toFixed(2)}`
            },
            {
                step: 'Find the foci',
                explanation: a > b
                    ? 'For horizontal ellipse, foci are at (h ± c, k)'
                    : 'For vertical ellipse, foci are at (h, k ± c)',
                formula: `Foci at (${(h - c).toFixed(2)}, ${k.toFixed(2)}) and (${(h + c).toFixed(2)}, ${k.toFixed(2)})`
            },
            {
                step: 'Calculate eccentricity',
                explanation: 'Eccentricity e = c/a measures how "stretched" the ellipse is.',
                formula: `e = ${eccentricity.toFixed(3)}`
            },
            {
                step: 'Calculate the area',
                explanation: 'Area = πab',
                formula: `Area = π(${a.toFixed(2)})(${b.toFixed(2)}) = ${area.toFixed(2)}`
            }
        ]
    }
}

/**
 * Generates solution for hyperbola: x²/a² - y²/b² = 1
 */
const generateHyperbolaSolution = ({ a = 3, b = 2 }, equation) => {
    const c = Math.sqrt(a * a + b * b)
    const eccentricity = c / a

    return {
        title: 'Hyperbola Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'A hyperbola has the form x²/a² - y²/b² = 1 (horizontal) or y²/a² - x²/b² = 1 (vertical)',
                formula: 'x²/a² - y²/b² = 1'
            },
            {
                step: 'Find the center',
                explanation: 'The center is at the origin (0, 0) for standard form.',
                formula: 'Center = (0, 0)'
            },
            {
                step: 'Find the vertices',
                explanation: 'Vertices are at (±a, 0) for horizontal hyperbola.',
                formula: `Vertices at (±${a.toFixed(2)}, 0)`
            },
            {
                step: 'Calculate the focal distance',
                explanation: 'c = √(a² + b²) for hyperbola',
                formula: `c = √(${a.toFixed(2)}² + ${b.toFixed(2)}²) = ${c.toFixed(2)}`
            },
            {
                step: 'Find the foci',
                explanation: 'Foci are at (±c, 0) for horizontal hyperbola.',
                formula: `Foci at (±${c.toFixed(2)}, 0)`
            },
            {
                step: 'Find the asymptotes',
                explanation: 'Asymptotes are lines the hyperbola approaches but never touches.',
                formula: `y = ±(${(b / a).toFixed(2)})x`
            },
            {
                step: 'Calculate eccentricity',
                explanation: 'Eccentricity e = c/a. For hyperbola, e > 1.',
                formula: `e = ${eccentricity.toFixed(3)}`
            }
        ]
    }
}

/**
 * Generates solution for exponential: y = a·e^(bx)
 */
const generateExponentialSolution = ({ a = 1, b = 1 }, equation) => {
    return {
        title: 'Exponential Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'An exponential function has the form y = a·e^(bx) or y = a·b^x',
                formula: 'y = a·e^(bx)'
            },
            {
                step: 'Find the initial value',
                explanation: 'When x = 0, y = a·e^0 = a. This is the y-intercept.',
                formula: `y-intercept = ${a.toFixed(2)}`
            },
            {
                step: 'Determine growth or decay',
                explanation: b > 0
                    ? 'Since b > 0, this is exponential GROWTH.'
                    : 'Since b < 0, this is exponential DECAY.',
                formula: `Type: ${b > 0 ? 'Growth 📈' : 'Decay 📉'}`
            },
            {
                step: 'Find the horizontal asymptote',
                explanation: 'The curve approaches but never reaches y = 0.',
                formula: 'Horizontal asymptote: y = 0'
            },
            {
                step: 'Determine the domain and range',
                explanation: 'Exponential functions are defined for all x, but output is restricted.',
                formula: `Domain: All real numbers\nRange: ${a > 0 ? 'y > 0' : 'y < 0'}`
            },
            {
                step: 'Find the growth/decay rate',
                explanation: 'The constant b determines how fast the function grows or decays.',
                formula: `Rate constant = ${b.toFixed(2)}`
            }
        ]
    }
}

/**
 * Generates solution for logarithmic: y = a·log(x)
 */
const generateLogarithmicSolution = ({ a = 1 }, equation) => {
    return {
        title: 'Logarithmic Equation Solution',
        steps: [
            {
                step: 'Identify the standard form',
                explanation: 'A logarithmic function has the form y = a·log(x) or y = a·ln(x)',
                formula: 'y = a·log(x)'
            },
            {
                step: 'Find the x-intercept',
                explanation: 'When y = 0, log(x) = 0, so x = 1.',
                formula: 'x-intercept = 1'
            },
            {
                step: 'Find the vertical asymptote',
                explanation: 'Logarithm is undefined for x ≤ 0, so x = 0 is a vertical asymptote.',
                formula: 'Vertical asymptote: x = 0'
            },
            {
                step: 'Determine the domain and range',
                explanation: 'Logarithmic functions are only defined for positive x.',
                formula: 'Domain: x > 0\nRange: All real numbers'
            },
            {
                step: 'Determine increasing or decreasing',
                explanation: a > 0
                    ? 'Since a > 0, the function is increasing.'
                    : 'Since a < 0, the function is decreasing.',
                formula: `Behavior: ${a > 0 ? 'Increasing ↗' : 'Decreasing ↘'}`
            },
            {
                step: 'Understand the inverse relationship',
                explanation: 'Logarithmic functions are inverses of exponential functions.',
                formula: 'If y = log(x), then x = 10^y'
            }
        ]
    }
}

/**
 * Generates solution for trigonometric: y = a·sin(bx + c) + d
 */
const generateTrigSolution = (type, { a = 1, b = 1, c = 0, d = 0 }, equation) => {
    const funcName = type === EQUATION_TYPES.SINE ? 'sin' : 'cos'
    const amplitude = Math.abs(a)
    const period = (2 * Math.PI) / Math.abs(b)
    const phaseShift = -c / b
    const minValue = d - amplitude
    const maxValue = d + amplitude

    return {
        title: `${funcName === 'sin' ? 'Sine' : 'Cosine'} Wave Solution`,
        steps: [
            {
                step: 'Identify the standard form',
                explanation: `A ${funcName === 'sin' ? 'sine' : 'cosine'} function has the form y = a·${funcName}(bx + c) + d`,
                formula: `y = a·${funcName}(bx + c) + d`
            },
            {
                step: 'Find the amplitude',
                explanation: 'Amplitude |a| determines the height of the wave.',
                formula: `Amplitude = |${a.toFixed(2)}| = ${amplitude.toFixed(2)}`
            },
            {
                step: 'Calculate the period',
                explanation: 'Period = 2π/|b| is the horizontal length of one complete cycle.',
                formula: `Period = 2π/${Math.abs(b).toFixed(2)} = ${period.toFixed(2)}`
            },
            {
                step: 'Find the frequency',
                explanation: 'Frequency = |b| determines how many cycles occur in 2π.',
                formula: `Frequency = ${Math.abs(b).toFixed(2)}`
            },
            {
                step: 'Calculate the phase shift',
                explanation: 'Phase shift = -c/b moves the graph horizontally.',
                formula: `Phase shift = ${phaseShift.toFixed(2)} (${phaseShift > 0 ? 'right' : 'left'})`
            },
            {
                step: 'Find the vertical shift',
                explanation: 'Vertical shift d moves the entire wave up or down.',
                formula: `Vertical shift = ${d.toFixed(2)}`
            },
            {
                step: 'Determine the range',
                explanation: 'The wave oscillates between min and max values.',
                formula: `Range: [${minValue.toFixed(2)}, ${maxValue.toFixed(2)}]`
            },
            {
                step: 'Find the midline',
                explanation: 'The midline is the horizontal line y = d.',
                formula: `Midline: y = ${d.toFixed(2)}`
            }
        ]
    }
}

export default generateSolution
