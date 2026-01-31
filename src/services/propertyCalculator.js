import { EQUATION_TYPES } from '../utils/constants'

/**
 * Calculates mathematical properties based on equation type
 * @param {string} type - Equation type
 * @param {Array} parameters - Parameter values
 * @returns {Object} - Calculated properties
 */
export const calculateProperties = (type, parameters) => {
    const paramMap = {}
    parameters.forEach(p => {
        paramMap[p.name] = p.value
    })

    switch (type) {
        case EQUATION_TYPES.LINEAR:
            return calculateLinearProperties(paramMap)
        case EQUATION_TYPES.QUADRATIC:
            return calculateQuadraticProperties(paramMap)
        case EQUATION_TYPES.CUBIC:
            return calculateCubicProperties(paramMap)
        case EQUATION_TYPES.CIRCLE:
            return calculateCircleProperties(paramMap)
        case EQUATION_TYPES.ELLIPSE:
            return calculateEllipseProperties(paramMap)
        case EQUATION_TYPES.HYPERBOLA:
            return calculateHyperbolaProperties(paramMap)
        case EQUATION_TYPES.EXPONENTIAL:
            return calculateExponentialProperties(paramMap)
        case EQUATION_TYPES.LOGARITHMIC:
            return calculateLogarithmicProperties(paramMap)
        case EQUATION_TYPES.SINE:
            return calculateSineProperties(paramMap)
        case EQUATION_TYPES.COSINE:
            return calculateCosineProperties(paramMap)
        default:
            return {}
    }
}

const calculateLinearProperties = ({ m = 1, b = 0 }) => {
    return {
        slope: m.toFixed(2),
        yIntercept: b.toFixed(2),
        xIntercept: m !== 0 ? (-b / m).toFixed(2) : 'undefined',
        direction: m > 0 ? 'Increasing' : m < 0 ? 'Decreasing' : 'Horizontal',
        angle: (Math.atan(m) * 180 / Math.PI).toFixed(2) + '°'
    }
}

const calculateQuadraticProperties = ({ a = 1, b = 0, c = 0 }) => {
    // Vertex
    const h = -b / (2 * a)
    const k = a * h * h + b * h + c

    // Discriminant
    const discriminant = b * b - 4 * a * c

    // Roots
    let roots = 'No real roots'
    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        roots = `x = ${root1.toFixed(2)}, x = ${root2.toFixed(2)}`
    } else if (discriminant === 0) {
        const root = -b / (2 * a)
        roots = `x = ${root.toFixed(2)} (double root)`
    }

    return {
        vertex: `(${h.toFixed(2)}, ${k.toFixed(2)})`,
        axisOfSymmetry: `x = ${h.toFixed(2)}`,
        direction: a > 0 ? 'Opens upward' : 'Opens downward',
        discriminant: discriminant.toFixed(2),
        roots,
        yIntercept: c.toFixed(2),
        vertexType: a > 0 ? 'Minimum' : 'Maximum'
    }
}

const calculateCubicProperties = ({ a = 1, b = 0, c = 0, d = 0 }) => {
    // Inflection point (where second derivative = 0)
    const inflectionX = -b / (3 * a)
    const inflectionY = a * Math.pow(inflectionX, 3) + b * Math.pow(inflectionX, 2) + c * inflectionX + d

    return {
        inflectionPoint: `(${inflectionX.toFixed(2)}, ${inflectionY.toFixed(2)})`,
        yIntercept: d.toFixed(2),
        endBehavior: a > 0
            ? 'Falls left, rises right'
            : 'Rises left, falls right',
        degree: '3 (cubic)'
    }
}

const calculateCircleProperties = ({ r = 5, h = 0, k = 0 }) => {
    return {
        center: `(${h.toFixed(2)}, ${k.toFixed(2)})`,
        radius: r.toFixed(2),
        diameter: (2 * r).toFixed(2),
        circumference: (2 * Math.PI * r).toFixed(2),
        area: (Math.PI * r * r).toFixed(2)
    }
}

const calculateEllipseProperties = ({ a = 5, b = 3, h = 0, k = 0 }) => {
    const c = Math.sqrt(Math.abs(a * a - b * b))
    const eccentricity = c / Math.max(a, b)

    return {
        center: `(${h.toFixed(2)}, ${k.toFixed(2)})`,
        semiMajorAxis: Math.max(a, b).toFixed(2),
        semiMinorAxis: Math.min(a, b).toFixed(2),
        focalDistance: c.toFixed(2),
        eccentricity: eccentricity.toFixed(3),
        area: (Math.PI * a * b).toFixed(2)
    }
}

const calculateHyperbolaProperties = ({ a = 3, b = 2 }) => {
    const c = Math.sqrt(a * a + b * b)
    const eccentricity = c / a

    return {
        center: '(0, 0)',
        vertices: `(±${a.toFixed(2)}, 0)`,
        foci: `(±${c.toFixed(2)}, 0)`,
        asymptotes: `y = ±${(b / a).toFixed(2)}x`,
        eccentricity: eccentricity.toFixed(3),
        transverseAxis: (2 * a).toFixed(2)
    }
}

const calculateExponentialProperties = ({ a = 1, b = 1 }) => {
    return {
        coefficient: a.toFixed(2),
        growthRate: b > 0 ? 'Growth' : 'Decay',
        yIntercept: a.toFixed(2),
        horizontalAsymptote: 'y = 0',
        domain: 'All real numbers',
        range: a > 0 ? 'y > 0' : 'y < 0'
    }
}

const calculateLogarithmicProperties = ({ a = 1 }) => {
    return {
        coefficient: a.toFixed(2),
        verticalAsymptote: 'x = 0',
        domain: 'x > 0',
        range: 'All real numbers',
        xIntercept: '1',
        behavior: a > 0 ? 'Increasing' : 'Decreasing'
    }
}

const calculateSineProperties = ({ a = 1, b = 1, c = 0, d = 0 }) => {
    const amplitude = Math.abs(a)
    const period = (2 * Math.PI) / Math.abs(b)
    const phaseShift = -c / b

    return {
        amplitude: amplitude.toFixed(2),
        period: period.toFixed(2),
        frequency: b.toFixed(2),
        phaseShift: phaseShift.toFixed(2),
        verticalShift: d.toFixed(2),
        range: `[${(d - amplitude).toFixed(2)}, ${(d + amplitude).toFixed(2)}]`,
        midline: `y = ${d.toFixed(2)}`
    }
}

const calculateCosineProperties = ({ a = 1, b = 1, c = 0, d = 0 }) => {
    const amplitude = Math.abs(a)
    const period = (2 * Math.PI) / Math.abs(b)
    const phaseShift = -c / b

    return {
        amplitude: amplitude.toFixed(2),
        period: period.toFixed(2),
        frequency: b.toFixed(2),
        phaseShift: phaseShift.toFixed(2),
        verticalShift: d.toFixed(2),
        range: `[${(d - amplitude).toFixed(2)}, ${(d + amplitude).toFixed(2)}]`,
        midline: `y = ${d.toFixed(2)}`
    }
}
