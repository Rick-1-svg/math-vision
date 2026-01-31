import { describe, it, expect } from 'vitest'
import { generateSolution } from '../services/solutionGenerator'
import { EQUATION_TYPES } from '../utils/constants'

describe('solutionGenerator', () => {
    describe('generateSolution', () => {
        describe('linear equations', () => {
            it('should generate linear solution with correct structure', () => {
                const params = [
                    { name: 'm', value: 2 },
                    { name: 'b', value: 3 }
                ]
                const solution = generateSolution(EQUATION_TYPES.LINEAR, params, '2*x+3')

                expect(solution).toBeDefined()
                expect(solution.title).toBe('Linear Equation Solution')
                expect(solution.steps).toBeInstanceOf(Array)
                expect(solution.steps.length).toBeGreaterThan(0)
            })

            it('should have step, explanation, and formula for each step', () => {
                const params = [
                    { name: 'm', value: 1 },
                    { name: 'b', value: 0 }
                ]
                const solution = generateSolution(EQUATION_TYPES.LINEAR, params, 'x')

                solution.steps.forEach(step => {
                    expect(step).toHaveProperty('step')
                    expect(step).toHaveProperty('explanation')
                    expect(step).toHaveProperty('formula')
                })
            })
        })

        describe('quadratic equations', () => {
            it('should generate quadratic solution', () => {
                const params = [
                    { name: 'a', value: 1 },
                    { name: 'b', value: -2 },
                    { name: 'c', value: -3 }
                ]
                const solution = generateSolution(EQUATION_TYPES.QUADRATIC, params, 'x^2-2*x-3')

                expect(solution.title).toBe('Quadratic Equation Solution')
                expect(solution.steps.length).toBeGreaterThanOrEqual(6)
            })

            it('should identify discriminant correctly', () => {
                const params = [
                    { name: 'a', value: 1 },
                    { name: 'b', value: 0 },
                    { name: 'c', value: -4 }
                ]
                const solution = generateSolution(EQUATION_TYPES.QUADRATIC, params, 'x^2-4')

                const discriminantStep = solution.steps.find(s =>
                    s.step.toLowerCase().includes('discriminant')
                )
                expect(discriminantStep).toBeDefined()
                expect(discriminantStep.formula).toContain('16') // b²-4ac = 0-4(1)(-4) = 16
            })

            it('should handle complex roots (D < 0)', () => {
                const params = [
                    { name: 'a', value: 1 },
                    { name: 'b', value: 0 },
                    { name: 'c', value: 4 }
                ]
                const solution = generateSolution(EQUATION_TYPES.QUADRATIC, params, 'x^2+4')

                const rootsStep = solution.steps.find(s =>
                    s.step.toLowerCase().includes('root')
                )
                expect(rootsStep.explanation).toContain('no real roots')
            })
        })

        describe('circle equations', () => {
            it('should generate circle solution', () => {
                const params = [
                    { name: 'r', value: 5 },
                    { name: 'h', value: 0 },
                    { name: 'k', value: 0 }
                ]
                const solution = generateSolution(EQUATION_TYPES.CIRCLE, params, 'x^2+y^2-25')

                expect(solution.title).toBe('Circle Equation Solution')
            })

            it('should calculate circumference correctly', () => {
                const params = [
                    { name: 'r', value: 5 },
                    { name: 'h', value: 0 },
                    { name: 'k', value: 0 }
                ]
                const solution = generateSolution(EQUATION_TYPES.CIRCLE, params, 'x^2+y^2-25')

                const circumStep = solution.steps.find(s =>
                    s.step.toLowerCase().includes('circumference')
                )
                expect(circumStep).toBeDefined()
                expect(circumStep.formula).toContain('31.4') // 2π*5 ≈ 31.41
            })
        })

        describe('trigonometric equations', () => {
            it('should generate sine solution', () => {
                const params = [
                    { name: 'a', value: 2 },
                    { name: 'b', value: 1 },
                    { name: 'c', value: 0 },
                    { name: 'd', value: 0 }
                ]
                const solution = generateSolution(EQUATION_TYPES.SINE, params, '2*sin(x)')

                expect(solution.title).toBe('Sine Wave Solution')
            })

            it('should calculate amplitude correctly', () => {
                const params = [
                    { name: 'a', value: 3 },
                    { name: 'b', value: 1 },
                    { name: 'c', value: 0 },
                    { name: 'd', value: 0 }
                ]
                const solution = generateSolution(EQUATION_TYPES.SINE, params, '3*sin(x)')

                const ampStep = solution.steps.find(s =>
                    s.step.toLowerCase().includes('amplitude')
                )
                expect(ampStep).toBeDefined()
                expect(ampStep.formula).toContain('3')
            })

            it('should calculate period correctly', () => {
                const params = [
                    { name: 'a', value: 1 },
                    { name: 'b', value: 2 },
                    { name: 'c', value: 0 },
                    { name: 'd', value: 0 }
                ]
                const solution = generateSolution(EQUATION_TYPES.SINE, params, 'sin(2*x)')

                const periodStep = solution.steps.find(s =>
                    s.step.toLowerCase().includes('period')
                )
                expect(periodStep).toBeDefined()
                expect(periodStep.formula).toContain('3.14') // 2π/2 = π ≈ 3.14
            })
        })

        describe('exponential equations', () => {
            it('should generate exponential solution', () => {
                const params = [
                    { name: 'a', value: 1 },
                    { name: 'b', value: 1 }
                ]
                const solution = generateSolution(EQUATION_TYPES.EXPONENTIAL, params, 'e^x')

                expect(solution.title).toBe('Exponential Equation Solution')
            })

            it('should identify growth vs decay', () => {
                const growthParams = [{ name: 'a', value: 1 }, { name: 'b', value: 1 }]
                const decayParams = [{ name: 'a', value: 1 }, { name: 'b', value: -1 }]

                const growthSolution = generateSolution(EQUATION_TYPES.EXPONENTIAL, growthParams, 'e^x')
                const decaySolution = generateSolution(EQUATION_TYPES.EXPONENTIAL, decayParams, 'e^(-x)')

                const growthStep = growthSolution.steps.find(s =>
                    s.step.toLowerCase().includes('growth or decay')
                )
                const decayStep = decaySolution.steps.find(s =>
                    s.step.toLowerCase().includes('growth or decay')
                )

                expect(growthStep.formula).toContain('Growth')
                expect(decayStep.formula).toContain('Decay')
            })
        })

        describe('unknown equations', () => {
            it('should handle unknown equation type', () => {
                const solution = generateSolution(EQUATION_TYPES.UNKNOWN, [], '???')

                expect(solution.title).toBe('Equation Analysis')
                expect(solution.steps.length).toBe(1)
            })
        })

        describe('error handling', () => {
            it('should handle empty parameters', () => {
                const solution = generateSolution(EQUATION_TYPES.LINEAR, [], 'x')

                expect(solution).toBeDefined()
                expect(solution.steps).toBeInstanceOf(Array)
            })

            it('should handle null parameters', () => {
                // Should not throw
                expect(() => {
                    generateSolution(EQUATION_TYPES.LINEAR, null, 'x')
                }).not.toThrow()
            })
        })
    })
})
