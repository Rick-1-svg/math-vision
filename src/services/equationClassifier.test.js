import { describe, it, expect } from 'vitest'
import { classifyEquation, extractParameters } from '../services/equationClassifier'
import { parseEquation } from '../services/equationParser'
import { EQUATION_TYPES } from '../utils/constants'

describe('equationClassifier', () => {
    describe('classifyEquation', () => {
        describe('trigonometric functions', () => {
            it('should classify sin(x) as SINE', () => {
                const parsed = parseEquation('sin(x)')
                const type = classifyEquation('sin(x)', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.SINE)
            })

            it('should classify 2*sin(3*x) as SINE', () => {
                const parsed = parseEquation('2*sin(3*x)')
                const type = classifyEquation('2*sin(3*x)', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.SINE)
            })

            it('should classify cos(x) as COSINE', () => {
                const parsed = parseEquation('cos(x)')
                const type = classifyEquation('cos(x)', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.COSINE)
            })
        })

        describe('exponential functions', () => {
            it('should classify e^x as EXPONENTIAL', () => {
                const parsed = parseEquation('e^x')
                const type = classifyEquation('e^x', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.EXPONENTIAL)
            })

            it('should classify exp(x) as EXPONENTIAL', () => {
                const parsed = parseEquation('exp(x)')
                const type = classifyEquation('exp(x)', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.EXPONENTIAL)
            })

            it('should classify 2*e^x as EXPONENTIAL', () => {
                const parsed = parseEquation('2*e^x')
                const type = classifyEquation('2*e^x', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.EXPONENTIAL)
            })
        })

        describe('logarithmic functions', () => {
            it('should classify log(x) as LOGARITHMIC', () => {
                const parsed = parseEquation('log(x)')
                const type = classifyEquation('log(x)', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.LOGARITHMIC)
            })

            it('should classify ln(x) as LOGARITHMIC', () => {
                const parsed = parseEquation('ln(x)')
                const type = classifyEquation('ln(x)', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.LOGARITHMIC)
            })
        })

        describe('polynomial functions', () => {
            it('should classify x^3 as CUBIC', () => {
                const parsed = parseEquation('x^3')
                const type = classifyEquation('x^3', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.CUBIC)
            })

            it('should classify x^2 as QUADRATIC', () => {
                const parsed = parseEquation('x^2')
                const type = classifyEquation('x^2', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.QUADRATIC)
            })

            it('should classify x^2+2*x-3 as QUADRATIC', () => {
                const parsed = parseEquation('x^2+2*x-3')
                const type = classifyEquation('x^2+2*x-3', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.QUADRATIC)
            })

            it('should classify 2*x+1 as LINEAR', () => {
                const parsed = parseEquation('2*x+1')
                const type = classifyEquation('2*x+1', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.LINEAR)
            })
        })

        describe('conic sections', () => {
            it('should classify x^2+y^2-25 as CIRCLE', () => {
                const parsed = parseEquation('x^2+y^2-25')
                const type = classifyEquation('x^2+y^2-25', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.CIRCLE)
            })

            it('should classify x^2/25+y^2/9-1 as ELLIPSE', () => {
                const parsed = parseEquation('x^2/25+y^2/9-1')
                const type = classifyEquation('x^2/25+y^2/9-1', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.ELLIPSE)
            })

            it('should classify x^2/16-y^2/9-1 as HYPERBOLA', () => {
                const parsed = parseEquation('x^2/16-y^2/9-1')
                const type = classifyEquation('x^2/16-y^2/9-1', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.HYPERBOLA)
            })
        })

        describe('unknown types', () => {
            it('should return UNKNOWN for unrecognized equations', () => {
                const parsed = parseEquation('1')
                const type = classifyEquation('1', parsed.data.node)
                expect(type).toBe(EQUATION_TYPES.UNKNOWN)
            })
        })
    })

    describe('extractParameters', () => {
        describe('linear parameters', () => {
            it('should extract slope and intercept', () => {
                const params = extractParameters('2*x+1', EQUATION_TYPES.LINEAR)
                expect(params).toHaveLength(2)
                expect(params.find(p => p.name === 'm')).toBeDefined()
                expect(params.find(p => p.name === 'b')).toBeDefined()
            })
        })

        describe('quadratic parameters', () => {
            it('should extract a, b, c coefficients', () => {
                const params = extractParameters('x^2+2*x-3', EQUATION_TYPES.QUADRATIC)
                expect(params).toHaveLength(3)
                expect(params.map(p => p.name)).toEqual(['a', 'b', 'c'])
            })
        })

        describe('trigonometric parameters', () => {
            it('should extract amplitude and frequency for sine', () => {
                const params = extractParameters('2*sin(3*x)', EQUATION_TYPES.SINE)
                expect(params.find(p => p.name === 'a')).toBeDefined()
                expect(params.find(p => p.name === 'b')).toBeDefined()
            })
        })

        describe('circle parameters', () => {
            it('should extract radius', () => {
                const params = extractParameters('x^2+y^2=25', EQUATION_TYPES.CIRCLE)
                expect(params.find(p => p.name === 'r')).toBeDefined()
            })
        })

        describe('parameter ranges', () => {
            it('should have valid min, max, step for all parameters', () => {
                const params = extractParameters('x^2', EQUATION_TYPES.QUADRATIC)
                params.forEach(p => {
                    expect(p.min).toBeDefined()
                    expect(p.max).toBeDefined()
                    expect(p.step).toBeDefined()
                    expect(p.min).toBeLessThan(p.max)
                })
            })
        })
    })
})
