import { describe, it, expect } from 'vitest'
import {
    parseEquation,
    evaluateAt,
    evaluateWithScope,
    isImplicitEquation,
    extractVariables
} from '../services/equationParser'

describe('equationParser', () => {
    describe('parseEquation', () => {
        describe('successful parsing', () => {
            it('should parse simple polynomial', () => {
                const result = parseEquation('x^2')
                expect(result.success).toBe(true)
                expect(result.data).toBeDefined()
                expect(result.data.node).toBeDefined()
                expect(result.data.compiled).toBeDefined()
                expect(result.error).toBeNull()
            })

            it('should parse quadratic equation', () => {
                const result = parseEquation('x^2+2*x-3')
                expect(result.success).toBe(true)
            })

            it('should parse trigonometric functions', () => {
                expect(parseEquation('sin(x)').success).toBe(true)
                expect(parseEquation('cos(x)').success).toBe(true)
            })

            it('should parse exponential functions', () => {
                expect(parseEquation('e^x').success).toBe(true)
                expect(parseEquation('exp(x)').success).toBe(true)
            })

            it('should parse logarithmic functions', () => {
                expect(parseEquation('log(x)').success).toBe(true)
                expect(parseEquation('ln(x)').success).toBe(true)
            })

            it('should preserve original equation', () => {
                const result = parseEquation('x^2+1')
                expect(result.data.original).toBe('x^2+1')
            })
        })

        describe('error handling', () => {
            it('should return error for invalid syntax', () => {
                const result = parseEquation('x^^2')
                expect(result.success).toBe(false)
                expect(result.error).toBeDefined()
                expect(result.error).toContain('Parse error')
            })

            it('should return error for unbalanced parentheses', () => {
                const result = parseEquation('sin(x')
                expect(result.success).toBe(false)
            })

            it('should handle empty input gracefully', () => {
                const result = parseEquation('')
                // Empty input sanitizes to empty, which may or may not parse
                // The key is it shouldn't throw
                expect(result).toBeDefined()
            })
        })
    })

    describe('evaluateAt', () => {
        it('should evaluate x^2 at x=2 to 4', () => {
            const parsed = parseEquation('x^2')
            const result = evaluateAt(parsed.data.compiled, 2)
            expect(result).toBe(4)
        })

        it('should evaluate sin(x) at x=0 to 0', () => {
            const parsed = parseEquation('sin(x)')
            const result = evaluateAt(parsed.data.compiled, 0)
            expect(result).toBeCloseTo(0)
        })

        it('should evaluate x+y at x=2, y=3 to 5', () => {
            const parsed = parseEquation('x+y')
            const result = evaluateAt(parsed.data.compiled, 2, 3)
            expect(result).toBe(5)
        })

        it('should return null for invalid results', () => {
            const parsed = parseEquation('1/x')
            const result = evaluateAt(parsed.data.compiled, 0)
            expect(result).toBeNull()
        })

        it('should handle division by zero gracefully', () => {
            const parsed = parseEquation('1/(x-1)')
            const result = evaluateAt(parsed.data.compiled, 1)
            expect(result).toBeNull()
        })
    })

    describe('evaluateWithScope', () => {
        it('should evaluate with custom scope', () => {
            const parsed = parseEquation('a*x^2+b*x+c')
            const result = evaluateWithScope(parsed.data.compiled, {
                x: 2,
                a: 1,
                b: 2,
                c: 1
            })
            // 1*4 + 2*2 + 1 = 9
            expect(result).toBe(9)
        })

        it('should use pi and e constants', () => {
            const parsed = parseEquation('pi')
            const result = evaluateWithScope(parsed.data.compiled, { x: 0 })
            expect(result).toBeCloseTo(Math.PI)
        })
    })

    describe('isImplicitEquation', () => {
        it('should return true for equations with both x and y', () => {
            expect(isImplicitEquation('x^2+y^2-25')).toBe(true)
            expect(isImplicitEquation('x^2/25+y^2/9-1')).toBe(true)
        })

        it('should return false for single-variable equations', () => {
            expect(isImplicitEquation('x^2+2*x-3')).toBe(false)
            expect(isImplicitEquation('sin(x)')).toBe(false)
        })
    })

    describe('extractVariables', () => {
        it('should extract x from simple equation', () => {
            const parsed = parseEquation('x^2')
            const vars = extractVariables(parsed.data.node)
            expect(vars).toContain('x')
        })

        it('should extract both x and y from circle equation', () => {
            const parsed = parseEquation('x^2+y^2-25')
            const vars = extractVariables(parsed.data.node)
            expect(vars).toContain('x')
            expect(vars).toContain('y')
        })

        it('should exclude constants e and pi', () => {
            const parsed = parseEquation('e*x+pi')
            const vars = extractVariables(parsed.data.node)
            expect(vars).not.toContain('e')
            expect(vars).not.toContain('pi')
            expect(vars).toContain('x')
        })
    })
})
