/**
 * Practice Problems Data
 * Curated problem sets for learning mathematical concepts
 * @module data/practiceProblems
 */

export const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
}

export const CATEGORIES = {
    POLYNOMIALS: 'polynomials',
    CONICS: 'conics',
    TRIGONOMETRY: 'trigonometry',
    EXPONENTIALS: 'exponentials',
    ALL: 'all'
}

/**
 * Practice problems organized by difficulty and category
 */
export const practiceProblems = [
    // === EASY: Polynomials ===
    {
        id: 'poly-easy-1',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'x^2',
        question: 'What is the vertex of the parabola y = x²?',
        answer: '(0, 0)',
        hints: [
            'The vertex is the minimum or maximum point of a parabola.',
            'For y = x², the parabola opens upward.',
            'The vertex formula is (-b/2a, f(-b/2a)) where a=1, b=0, c=0.'
        ],
        explanation: 'For y = x², we have a=1, b=0, c=0. The vertex is at x = -b/(2a) = 0. So y = 0² = 0. Vertex is (0, 0).',
        points: 10
    },
    {
        id: 'poly-easy-2',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'x^2-4',
        question: 'What are the x-intercepts (roots) of y = x² - 4?',
        answer: 'x = 2, x = -2',
        alternateAnswers: ['2 and -2', '(-2, 0) and (2, 0)', 'x = ±2'],
        hints: [
            'To find x-intercepts, set y = 0.',
            'Solve x² - 4 = 0',
            'This is a difference of squares: x² - 4 = (x+2)(x-2)'
        ],
        explanation: 'Setting y = 0: x² - 4 = 0 → x² = 4 → x = ±2. The roots are x = 2 and x = -2.',
        points: 10
    },
    {
        id: 'poly-easy-3',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: '2*x+3',
        question: 'What is the slope of the line y = 2x + 3?',
        answer: '2',
        hints: [
            'A linear equation has the form y = mx + b.',
            'm is the slope, b is the y-intercept.',
            'Look at the coefficient of x.'
        ],
        explanation: 'In y = 2x + 3, comparing to y = mx + b, we see m = 2. The slope is 2.',
        points: 10
    },
    {
        id: 'poly-easy-4',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'x^2+2*x+1',
        question: 'Does y = x² + 2x + 1 open upward or downward?',
        answer: 'upward',
        alternateAnswers: ['up', 'opens upward', 'opens up'],
        hints: [
            'The direction depends on the coefficient of x².',
            'If a > 0, parabola opens upward.',
            'If a < 0, parabola opens downward.'
        ],
        explanation: 'The coefficient of x² is 1, which is positive. Therefore, the parabola opens upward.',
        points: 10
    },

    // === MEDIUM: Polynomials ===
    {
        id: 'poly-med-1',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: 'x^2-6*x+5',
        question: 'Find the vertex of y = x² - 6x + 5.',
        answer: '(3, -4)',
        alternateAnswers: ['3, -4', 'vertex at (3,-4)'],
        hints: [
            'Use the vertex formula: x = -b/(2a)',
            'Here a = 1, b = -6, c = 5',
            'After finding x, substitute back to find y'
        ],
        explanation: 'x = -(-6)/(2×1) = 6/2 = 3. Then y = 3² - 6(3) + 5 = 9 - 18 + 5 = -4. Vertex is (3, -4).',
        points: 20
    },
    {
        id: 'poly-med-2',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: '2*x^2+4*x-6',
        question: 'Calculate the discriminant of y = 2x² + 4x - 6.',
        answer: '64',
        hints: [
            'Discriminant formula: D = b² - 4ac',
            'Here a = 2, b = 4, c = -6',
            'Calculate: 4² - 4(2)(-6)'
        ],
        explanation: 'D = b² - 4ac = 4² - 4(2)(-6) = 16 + 48 = 64. Since D > 0, there are two distinct real roots.',
        points: 20
    },
    {
        id: 'poly-med-3',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: 'x^3-3*x^2+2*x',
        question: 'How many x-intercepts does y = x³ - 3x² + 2x have?',
        answer: '3',
        alternateAnswers: ['three', '3 roots', '3 x-intercepts'],
        hints: [
            'Factor out x first: x(x² - 3x + 2)',
            'Then factor the quadratic',
            'Count the number of factors'
        ],
        explanation: 'x³ - 3x² + 2x = x(x² - 3x + 2) = x(x-1)(x-2). Setting to 0 gives x = 0, 1, 2. Three x-intercepts.',
        points: 20
    },

    // === EASY: Conics ===
    {
        id: 'conic-easy-1',
        category: CATEGORIES.CONICS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'x^2+y^2-25',
        question: 'What is the radius of the circle x² + y² = 25?',
        answer: '5',
        hints: [
            'A circle has the form x² + y² = r².',
            'Compare 25 to r².',
            'Solve for r.'
        ],
        explanation: 'x² + y² = 25 means r² = 25, so r = √25 = 5.',
        points: 10
    },
    {
        id: 'conic-easy-2',
        category: CATEGORIES.CONICS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'x^2+y^2-16',
        question: 'What is the center of the circle x² + y² = 16?',
        answer: '(0, 0)',
        alternateAnswers: ['origin', '0, 0', 'the origin'],
        hints: [
            'Standard form: (x-h)² + (y-k)² = r²',
            'The center is at (h, k).',
            'When there is no (x-h), h = 0.'
        ],
        explanation: 'The equation x² + y² = 16 is in the form (x-0)² + (y-0)² = 16, so the center is (0, 0).',
        points: 10
    },

    // === MEDIUM: Conics ===
    {
        id: 'conic-med-1',
        category: CATEGORIES.CONICS,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: 'x^2+y^2-36',
        question: 'What is the circumference of the circle x² + y² = 36? (Use π ≈ 3.14)',
        answer: '37.68',
        alternateAnswers: ['37.7', '12π', '12pi', '≈37.68'],
        hints: [
            'First find the radius: r² = 36',
            'Circumference = 2πr',
            'Calculate: 2 × 3.14 × r'
        ],
        explanation: 'r² = 36, so r = 6. Circumference = 2πr = 2 × 3.14 × 6 = 37.68.',
        points: 20
    },
    {
        id: 'conic-med-2',
        category: CATEGORIES.CONICS,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: 'x^2/25+y^2/9-1',
        question: 'For the ellipse x²/25 + y²/9 = 1, what are the lengths of the semi-major and semi-minor axes?',
        answer: 'a = 5, b = 3',
        alternateAnswers: ['5 and 3', 'semi-major: 5, semi-minor: 3'],
        hints: [
            'Standard form: x²/a² + y²/b² = 1',
            '25 = a², so a = ?',
            '9 = b², so b = ?'
        ],
        explanation: 'x²/25 + y²/9 = 1. Here a² = 25, so a = 5 (semi-major). b² = 9, so b = 3 (semi-minor).',
        points: 20
    },

    // === EASY: Trigonometry ===
    {
        id: 'trig-easy-1',
        category: CATEGORIES.TRIGONOMETRY,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'sin(x)',
        question: 'What is the amplitude of y = sin(x)?',
        answer: '1',
        hints: [
            'Amplitude is the height from midline to peak.',
            'For y = a·sin(x), amplitude is |a|.',
            'What is the coefficient of sin(x)?'
        ],
        explanation: 'For y = sin(x), the coefficient a = 1, so amplitude = |1| = 1.',
        points: 10
    },
    {
        id: 'trig-easy-2',
        category: CATEGORIES.TRIGONOMETRY,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'sin(x)',
        question: 'What is the period of y = sin(x)?',
        answer: '2π',
        alternateAnswers: ['2pi', '6.28', '≈6.28', '360 degrees'],
        hints: [
            'Period is the length of one complete cycle.',
            'For y = sin(bx), period = 2π/b.',
            'Here b = 1.'
        ],
        explanation: 'For y = sin(x), b = 1. Period = 2π/1 = 2π ≈ 6.28.',
        points: 10
    },
    {
        id: 'trig-easy-3',
        category: CATEGORIES.TRIGONOMETRY,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'cos(x)',
        question: 'What is y when x = 0 for y = cos(x)?',
        answer: '1',
        hints: [
            'Substitute x = 0 into the equation.',
            'cos(0) = ?',
            'Think about the unit circle.'
        ],
        explanation: 'y = cos(0) = 1. Cosine starts at its maximum value.',
        points: 10
    },

    // === MEDIUM: Trigonometry ===
    {
        id: 'trig-med-1',
        category: CATEGORIES.TRIGONOMETRY,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: '3*sin(2*x)',
        question: 'What is the amplitude and period of y = 3sin(2x)?',
        answer: 'amplitude = 3, period = π',
        alternateAnswers: ['3 and π', 'amp: 3, period: pi', 'amplitude 3, period π'],
        hints: [
            'For y = a·sin(bx): amplitude = |a|, period = 2π/b',
            'Here a = 3 and b = 2',
            'Calculate each property'
        ],
        explanation: 'Amplitude = |3| = 3. Period = 2π/2 = π.',
        points: 20
    },
    {
        id: 'trig-med-2',
        category: CATEGORIES.TRIGONOMETRY,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        equation: '2*cos(x)+1',
        question: 'What is the range of y = 2cos(x) + 1?',
        answer: '[-1, 3]',
        alternateAnswers: ['-1 to 3', 'from -1 to 3', 'min -1, max 3'],
        hints: [
            'Range of cos(x) is [-1, 1].',
            'Multiply by 2: range becomes [-2, 2].',
            'Add 1: shift the range up by 1.'
        ],
        explanation: 'cos(x) ranges from -1 to 1. 2cos(x) ranges from -2 to 2. 2cos(x)+1 ranges from -1 to 3.',
        points: 20
    },

    // === EASY: Exponentials ===
    {
        id: 'exp-easy-1',
        category: CATEGORIES.EXPONENTIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'e^x',
        question: 'What is the y-intercept of y = eˣ?',
        answer: '1',
        alternateAnswers: ['(0, 1)', 'y = 1 when x = 0'],
        hints: [
            'Y-intercept occurs when x = 0.',
            'Calculate e⁰.',
            'Any number to the power of 0 equals...?'
        ],
        explanation: 'When x = 0, y = e⁰ = 1. The y-intercept is (0, 1).',
        points: 10
    },
    {
        id: 'exp-easy-2',
        category: CATEGORIES.EXPONENTIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'e^x',
        question: 'What is the horizontal asymptote of y = eˣ?',
        answer: 'y = 0',
        alternateAnswers: ['0', 'the x-axis', 'y=0'],
        hints: [
            'What happens to eˣ as x → -∞?',
            'e raised to a very negative number approaches...?',
            'The curve gets closer to but never reaches this value.'
        ],
        explanation: 'As x → -∞, eˣ → 0. The horizontal asymptote is y = 0 (the x-axis).',
        points: 10
    },
    {
        id: 'exp-easy-3',
        category: CATEGORIES.EXPONENTIALS,
        difficulty: DIFFICULTY_LEVELS.EASY,
        equation: 'log(x)',
        question: 'What is the x-intercept of y = log(x)?',
        answer: '1',
        alternateAnswers: ['(1, 0)', 'x = 1'],
        hints: [
            'X-intercept occurs when y = 0.',
            'Solve log(x) = 0.',
            '10⁰ = ?'
        ],
        explanation: 'When y = 0, log(x) = 0, which means x = 10⁰ = 1. X-intercept is (1, 0).',
        points: 10
    },

    // === HARD: Mixed ===
    {
        id: 'hard-1',
        category: CATEGORIES.POLYNOMIALS,
        difficulty: DIFFICULTY_LEVELS.HARD,
        equation: 'x^2-4*x+4',
        question: 'Find the roots and determine the nature of the roots for y = x² - 4x + 4.',
        answer: 'x = 2 (double root)',
        alternateAnswers: ['x=2 double root', 'one repeated root at x=2', 'x = 2, repeated'],
        hints: [
            'Use the discriminant: D = b² - 4ac',
            'Here a=1, b=-4, c=4',
            'If D=0, there is a double root.'
        ],
        explanation: 'D = (-4)² - 4(1)(4) = 16 - 16 = 0. Since D = 0, there is one repeated root. x = -b/(2a) = 4/2 = 2.',
        points: 30
    },
    {
        id: 'hard-2',
        category: CATEGORIES.CONICS,
        difficulty: DIFFICULTY_LEVELS.HARD,
        equation: 'x^2/16-y^2/9-1',
        question: 'Find the equations of the asymptotes for the hyperbola x²/16 - y²/9 = 1.',
        answer: 'y = ±(3/4)x',
        alternateAnswers: ['y = 3x/4 and y = -3x/4', 'y = ±0.75x'],
        hints: [
            'For hyperbola x²/a² - y²/b² = 1, asymptotes are y = ±(b/a)x',
            'Here a² = 16, so a = 4',
            'Here b² = 9, so b = 3'
        ],
        explanation: 'a = 4, b = 3. Asymptotes: y = ±(b/a)x = ±(3/4)x.',
        points: 30
    },
    {
        id: 'hard-3',
        category: CATEGORIES.TRIGONOMETRY,
        difficulty: DIFFICULTY_LEVELS.HARD,
        equation: '2*sin(3*x-pi/2)+1',
        question: 'Find the phase shift of y = 2sin(3x - π/2) + 1.',
        answer: 'π/6 to the right',
        alternateAnswers: ['π/6', 'pi/6', '0.52 to the right', 'right π/6'],
        hints: [
            'Standard form: y = a·sin(bx - c) + d',
            'Phase shift = c/b',
            'Here b = 3 and c = π/2'
        ],
        explanation: 'Comparing to y = a·sin(b(x - c/b)) + d, phase shift = (π/2)/3 = π/6 to the right.',
        points: 30
    }
]

/**
 * Get problems by category
 */
export const getProblemsByCategory = (category) => {
    if (category === CATEGORIES.ALL) {
        return practiceProblems
    }
    return practiceProblems.filter(p => p.category === category)
}

/**
 * Get problems by difficulty
 */
export const getProblemsByDifficulty = (difficulty) => {
    return practiceProblems.filter(p => p.difficulty === difficulty)
}

/**
 * Get problems by category and difficulty
 */
export const getProblems = (category = CATEGORIES.ALL, difficulty = null) => {
    let filtered = category === CATEGORIES.ALL
        ? practiceProblems
        : practiceProblems.filter(p => p.category === category)

    if (difficulty) {
        filtered = filtered.filter(p => p.difficulty === difficulty)
    }

    return filtered
}

/**
 * Validate user answer
 */
export const validateAnswer = (problemId, userAnswer) => {
    const problem = practiceProblems.find(p => p.id === problemId)
    if (!problem) {
        return { correct: false, error: 'Problem not found' }
    }

    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, '')
    const correctNormalized = problem.answer.toLowerCase().trim().replace(/\s+/g, '')

    if (normalized === correctNormalized) {
        return { correct: true, explanation: problem.explanation, points: problem.points }
    }

    // Check alternate answers
    if (problem.alternateAnswers) {
        for (const alt of problem.alternateAnswers) {
            if (normalized === alt.toLowerCase().trim().replace(/\s+/g, '')) {
                return { correct: true, explanation: problem.explanation, points: problem.points }
            }
        }
    }

    return {
        correct: false,
        correctAnswer: problem.answer,
        explanation: problem.explanation
    }
}

export default practiceProblems
