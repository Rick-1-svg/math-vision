// Equation types enum
export const EQUATION_TYPES = {
    LINEAR: 'linear',
    QUADRATIC: 'quadratic',
    CUBIC: 'cubic',
    CIRCLE: 'circle',
    ELLIPSE: 'ellipse',
    HYPERBOLA: 'hyperbola',
    EXPONENTIAL: 'exponential',
    LOGARITHMIC: 'logarithmic',
    SINE: 'sine',
    COSINE: 'cosine',
    TANGENT: 'tangent',
    THREE_D: 'three_d',
    UNKNOWN: 'unknown'
}

// Preset equations for quick testing
export const PRESET_EQUATIONS = [
    // Quadratic
    { type: EQUATION_TYPES.QUADRATIC, equation: 'x^2', label: 'Basic Parabola', category: 'Quadratic' },
    { type: EQUATION_TYPES.QUADRATIC, equation: 'x^2 - 4', label: 'Shifted Parabola', category: 'Quadratic' },
    { type: EQUATION_TYPES.QUADRATIC, equation: '2*x^2 + 3*x - 5', label: 'General Quadratic', category: 'Quadratic' },

    // Linear
    { type: EQUATION_TYPES.LINEAR, equation: '2*x + 1', label: 'Linear Function', category: 'Linear' },
    { type: EQUATION_TYPES.LINEAR, equation: '-x + 3', label: 'Negative Slope', category: 'Linear' },

    // Cubic
    { type: EQUATION_TYPES.CUBIC, equation: 'x^3', label: 'Basic Cubic', category: 'Cubic' },
    { type: EQUATION_TYPES.CUBIC, equation: 'x^3 - 2*x^2 + x - 1', label: 'General Cubic', category: 'Cubic' },

    // Circle
    { type: EQUATION_TYPES.CIRCLE, equation: 'x^2 + y^2 - 25', label: 'Circle r=5', category: 'Conic' },
    { type: EQUATION_TYPES.CIRCLE, equation: 'x^2 + y^2 - 16', label: 'Circle r=4', category: 'Conic' },

    // Exponential
    { type: EQUATION_TYPES.EXPONENTIAL, equation: 'e^x', label: 'Natural Exponential', category: 'Exponential' },
    { type: EQUATION_TYPES.EXPONENTIAL, equation: '2*e^x', label: 'Scaled Exponential', category: 'Exponential' },
    { type: EQUATION_TYPES.EXPONENTIAL, equation: 'e^(-x)', label: 'Decay Function', category: 'Exponential' },

    // Logarithmic
    { type: EQUATION_TYPES.LOGARITHMIC, equation: 'log(x)', label: 'Common Log', category: 'Logarithmic' },
    { type: EQUATION_TYPES.LOGARITHMIC, equation: 'ln(x)', label: 'Natural Log', category: 'Logarithmic' },

    // Trigonometric
    { type: EQUATION_TYPES.SINE, equation: 'sin(x)', label: 'Sine Wave', category: 'Trigonometric' },
    { type: EQUATION_TYPES.SINE, equation: '2*sin(3*x)', label: 'Amplitude & Frequency', category: 'Trigonometric' },
    { type: EQUATION_TYPES.COSINE, equation: 'cos(x)', label: 'Cosine Wave', category: 'Trigonometric' },
    { type: EQUATION_TYPES.COSINE, equation: '3*cos(2*x)', label: 'Scaled Cosine', category: 'Trigonometric' },

    // 3D Surfaces
    { type: EQUATION_TYPES.THREE_D, equation: 'sin(x) * cos(y)', label: '3D Wave', category: '3D Surfaces' },
    { type: EQUATION_TYPES.THREE_D, equation: 'x^2 + y^2', label: 'Paraboloid', category: '3D Surfaces' },
    { type: EQUATION_TYPES.THREE_D, equation: 'x^2 - y^2', label: 'Saddle Point', category: '3D Surfaces' },
    { type: EQUATION_TYPES.THREE_D, equation: 'sin(sqrt(x^2 + y^2))', label: 'Ripple Effect', category: '3D Surfaces' },

    // Shapes
    { type: EQUATION_TYPES.ELLIPSE, equation: '(x^2)/16 + (y^2)/9 - 1', label: 'Ellipse', category: 'Conic' },
    { type: EQUATION_TYPES.HYPERBOLA, equation: '(x^2)/4 - (y^2)/9 - 1', label: 'Hyperbola', category: 'Conic' },
]

// Educational descriptions for each equation type
export const EQUATION_DESCRIPTIONS = {
    [EQUATION_TYPES.LINEAR]: {
        name: 'Linear Function',
        description: 'A straight line representing a constant rate of change. Linear functions model proportional relationships and are the foundation of algebra.',
        standardForm: 'y = mx + b'
    },
    [EQUATION_TYPES.QUADRATIC]: {
        name: 'Quadratic Function',
        description: 'A parabola representing acceleration, projectile motion, and optimization problems. The vertex represents the maximum or minimum point.',
        standardForm: 'y = ax² + bx + c'
    },
    [EQUATION_TYPES.CUBIC]: {
        name: 'Cubic Function',
        description: 'A polynomial of degree 3 with up to two turning points. Cubic functions can model volume relationships and complex growth patterns.',
        standardForm: 'y = ax³ + bx² + cx + d'
    },
    [EQUATION_TYPES.CIRCLE]: {
        name: 'Circle',
        description: 'The set of all points equidistant from a center point. Circles represent perfect symmetry and appear in physics, engineering, and nature.',
        standardForm: 'x² + y² = r²'
    },
    [EQUATION_TYPES.ELLIPSE]: {
        name: 'Ellipse',
        description: 'An oval shape with two focal points. Ellipses describe planetary orbits and are fundamental in astronomy and optics.',
        standardForm: 'x²/a² + y²/b² = 1'
    },
    [EQUATION_TYPES.HYPERBOLA]: {
        name: 'Hyperbola',
        description: 'Two mirror-image curves with asymptotes. Hyperbolas model inverse relationships and appear in navigation systems.',
        standardForm: 'x²/a² - y²/b² = 1'
    },
    [EQUATION_TYPES.EXPONENTIAL]: {
        name: 'Exponential Function',
        description: 'Rapid growth or decay functions modeling population growth, radioactive decay, and compound interest. The curve never touches the x-axis.',
        standardForm: 'y = a·eᵇˣ'
    },
    [EQUATION_TYPES.LOGARITHMIC]: {
        name: 'Logarithmic Function',
        description: 'The inverse of exponential functions, modeling phenomena that grow quickly then level off, like sound intensity and pH scales.',
        standardForm: 'y = a·log(bx)'
    },
    [EQUATION_TYPES.SINE]: {
        name: 'Sine Wave',
        description: 'Periodic oscillation representing sound waves, ocean tides, and alternating current. The wave repeats every 2π units with smooth peaks and valleys.',
        standardForm: 'y = a·sin(bx + c) + d'
    },
    [EQUATION_TYPES.COSINE]: {
        name: 'Cosine Wave',
        description: 'Similar to sine but shifted by π/2. Cosine waves model periodic motion and are essential in signal processing and physics.',
        standardForm: 'y = a·cos(bx + c) + d'
    },
    [EQUATION_TYPES.TANGENT]: {
        name: 'Tangent Function',
        description: 'A periodic function with vertical asymptotes. Tangent represents the ratio of sine to cosine and appears in trigonometry and geometry.',
        standardForm: 'y = a·tan(bx + c) + d'
    },
    [EQUATION_TYPES.THREE_D]: {
        name: '3D Surface',
        description: 'A function of two variables z = f(x,y). These surfaces exist in specific 3D space and allow visualizing complex relationships.',
        standardForm: 'z = f(x, y)'
    }
}

// Default parameter ranges for each equation type
export const DEFAULT_PARAMETER_RANGES = {
    a: { min: -10, max: 10, step: 0.1, default: 1 },
    b: { min: -10, max: 10, step: 0.1, default: 1 },
    c: { min: -10, max: 10, step: 0.1, default: 0 },
    d: { min: -10, max: 10, step: 0.1, default: 0 },
    r: { min: 0.1, max: 20, step: 0.1, default: 5 },
    h: { min: -10, max: 10, step: 0.1, default: 0 },
    k: { min: -10, max: 10, step: 0.1, default: 0 }
}
