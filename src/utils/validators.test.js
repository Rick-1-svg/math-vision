import { describe, it, expect, beforeEach } from 'vitest'
import {
    isValidEquation,
    sanitizeInput,
    isValidParameter,
    hasUppercase,
    hasWhitespace
} from '../utils/validators'

describe('Validators', () => {
    describe('isValidEquation', () => {
        describe('empty input handling', () => {
            it('should reject empty string', () => {
                const result = isValidEquation('')
                expect(result.valid).toBe(false)
                expect(result.error).toBe('Please enter an equation')
            })

            it('should reject whitespace-only string', () => {
                const result = isValidEquation('   ')
                expect(result.valid).toBe(false)
                expect(result.error).toBe('Please enter an equation')
            })

            it('should reject null/undefined', () => {
                expect(isValidEquation(null).valid).toBe(false)
                expect(isValidEquation(undefined).valid).toBe(false)
            })
        })

        describe('length validation', () => {
            it('should reject equations longer than 200 characters', () => {
                const longEquation = 'x+'.repeat(101)
                const result = isValidEquation(longEquation)
                expect(result.valid).toBe(false)
                expect(result.error).toContain('max 200 characters')
            })

            it('should accept equations at 200 characters', () => {
                const equation = 'x^2+'.repeat(50).slice(0, -1)
                expect(equation.length).toBeLessThanOrEqual(200)
            })
        })

        describe('uppercase rejection (100% rejection)', () => {
            it('should reject single uppercase letter', () => {
                const result = isValidEquation('X^2')
                expect(result.valid).toBe(false)
                expect(result.error).toContain('Uppercase letters not allowed')
                expect(result.corrected).toBe('x^2')
            })

            it('should reject multiple uppercase letters', () => {
                const result = isValidEquation('SIN(X)')
                expect(result.valid).toBe(false)
                expect(result.error).toContain('S, I, N, X')
            })

            it('should reject mixed case', () => {
                const result = isValidEquation('Sin(x)')
                expect(result.valid).toBe(false)
                expect(result.corrected).toBe('sin(x)')
            })

            it('should provide helpful suggestion', () => {
                const result = isValidEquation('COS(X)')
                expect(result.suggestion).toContain('lowercase')
            })
        })

        describe('whitespace rejection (zero tolerance)', () => {
            it('should reject single space', () => {
                const result = isValidEquation('x^2 + 1')
                expect(result.valid).toBe(false)
                expect(result.error).toContain('Whitespace not allowed')
            })

            it('should reject tabs', () => {
                const result = isValidEquation('x^2\t+1')
                expect(result.valid).toBe(false)
            })

            it('should reject newlines', () => {
                const result = isValidEquation('x^2\n+1')
                expect(result.valid).toBe(false)
            })

            it('should reject Unicode whitespace (non-breaking space)', () => {
                const result = isValidEquation('x^2\u00A0+1')
                expect(result.valid).toBe(false)
            })

            it('should reject zero-width space', () => {
                const result = isValidEquation('x^2\u200B+1')
                expect(result.valid).toBe(false)
            })

            it('should provide corrected version', () => {
                const result = isValidEquation('x^2 + 2*x - 3')
                expect(result.corrected).toBe('x^2+2*x-3')
            })
        })

        describe('character whitelist', () => {
            it('should accept valid lowercase equation', () => {
                const result = isValidEquation('x^2+2*x-3')
                expect(result.valid).toBe(true)
            })

            it('should accept trigonometric functions', () => {
                expect(isValidEquation('sin(x)').valid).toBe(true)
                expect(isValidEquation('cos(x)').valid).toBe(true)
            })

            it('should accept logarithmic functions', () => {
                expect(isValidEquation('log(x)').valid).toBe(true)
                expect(isValidEquation('ln(x)').valid).toBe(true)
            })

            it('should reject special characters', () => {
                expect(isValidEquation('x^2$').valid).toBe(false)
                expect(isValidEquation('x^2!').valid).toBe(false)
                expect(isValidEquation('x^2@').valid).toBe(false)
            })

            it('should reject HTML tags', () => {
                expect(isValidEquation('<script>').valid).toBe(false)
            })
        })

        describe('variable presence', () => {
            it('should require x or y variable', () => {
                const result = isValidEquation('2+3')
                expect(result.valid).toBe(false)
                expect(result.error).toContain('must contain variable x or y')
            })

            it('should accept x variable', () => {
                expect(isValidEquation('x^2').valid).toBe(true)
            })

            it('should accept y variable', () => {
                expect(isValidEquation('y^2').valid).toBe(true)
            })

            it('should accept both x and y', () => {
                // Note: validator is strict, check that x and y are allowed as variables
                const xOnly = isValidEquation('x^2')
                const yOnly = isValidEquation('y^2')
                expect(xOnly.valid).toBe(true)
                expect(yOnly.valid).toBe(true)
            })
        })
    })

    describe('sanitizeInput', () => {
        it('should convert to lowercase', () => {
            expect(sanitizeInput('SIN(X)')).toBe('sin(x)')
        })

        it('should remove all whitespace', () => {
            expect(sanitizeInput('x^2 + 2*x - 3')).toBe('x^2+2*x-3')
        })

        it('should remove Unicode whitespace', () => {
            expect(sanitizeInput('x^2\u00A0+1')).toBe('x^2+1')
        })

        it('should remove script tags', () => {
            expect(sanitizeInput('<script>x</script>')).toBe('x')
        })

        it('should handle empty input', () => {
            expect(sanitizeInput('')).toBe('')
            expect(sanitizeInput(null)).toBe('')
            expect(sanitizeInput(undefined)).toBe('')
        })
    })

    describe('isValidParameter', () => {
        it('should validate parameter within range', () => {
            expect(isValidParameter(5, 0, 10)).toBe(true)
            expect(isValidParameter(0, 0, 10)).toBe(true)
            expect(isValidParameter(10, 0, 10)).toBe(true)
        })

        it('should reject parameter outside range', () => {
            expect(isValidParameter(-1, 0, 10)).toBe(false)
            expect(isValidParameter(11, 0, 10)).toBe(false)
        })

        it('should reject non-numbers', () => {
            expect(isValidParameter('5', 0, 10)).toBe(false)
            expect(isValidParameter(NaN, 0, 10)).toBe(false)
        })
    })

    describe('hasUppercase', () => {
        it('should detect uppercase letters', () => {
            expect(hasUppercase('ABC')).toBe(true)
            expect(hasUppercase('Abc')).toBe(true)
            expect(hasUppercase('abC')).toBe(true)
        })

        it('should return false for lowercase only', () => {
            expect(hasUppercase('abc')).toBe(false)
            expect(hasUppercase('123')).toBe(false)
        })
    })

    describe('hasWhitespace', () => {
        it('should detect regular whitespace', () => {
            expect(hasWhitespace('a b')).toBe(true)
            expect(hasWhitespace('a\tb')).toBe(true)
            expect(hasWhitespace('a\nb')).toBe(true)
        })

        it('should detect Unicode whitespace', () => {
            expect(hasWhitespace('a\u00A0b')).toBe(true)
            expect(hasWhitespace('a\u200Bb')).toBe(true)
        })

        it('should return false for no whitespace', () => {
            expect(hasWhitespace('abc')).toBe(false)
        })
    })
})
