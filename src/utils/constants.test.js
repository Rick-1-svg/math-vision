import { describe, it, expect } from 'vitest'
import { EQUATION_TYPES, PRESET_EQUATIONS, EQUATION_DESCRIPTIONS } from '../utils/constants'

describe('Constants', () => {
    describe('EQUATION_TYPES', () => {
        it('should define all equation types', () => {
            expect(Object.keys(EQUATION_TYPES).length).toBeGreaterThanOrEqual(10)
        })

        it('should have correct type values', () => {
            expect(EQUATION_TYPES.LINEAR).toBe('linear')
            expect(EQUATION_TYPES.QUADRATIC).toBe('quadratic')
            expect(EQUATION_TYPES.CUBIC).toBe('cubic')
            expect(EQUATION_TYPES.CIRCLE).toBe('circle')
            expect(EQUATION_TYPES.ELLIPSE).toBe('ellipse')
            expect(EQUATION_TYPES.HYPERBOLA).toBe('hyperbola')
            expect(EQUATION_TYPES.EXPONENTIAL).toBe('exponential')
            expect(EQUATION_TYPES.LOGARITHMIC).toBe('logarithmic')
            expect(EQUATION_TYPES.SINE).toBe('sine')
            expect(EQUATION_TYPES.COSINE).toBe('cosine')
            expect(EQUATION_TYPES.UNKNOWN).toBe('unknown')
        })
    })

    describe('PRESET_EQUATIONS', () => {
        it('should have at least 15 preset equations', () => {
            expect(PRESET_EQUATIONS.length).toBeGreaterThanOrEqual(15)
        })

        it('should have required properties for each preset', () => {
            PRESET_EQUATIONS.forEach(preset => {
                expect(preset).toHaveProperty('type')
                expect(preset).toHaveProperty('equation')
                expect(preset).toHaveProperty('label')
                expect(preset).toHaveProperty('category')
            })
        })

        it('should cover all main equation types', () => {
            const types = [...new Set(PRESET_EQUATIONS.map(p => p.type))]
            expect(types).toContain(EQUATION_TYPES.QUADRATIC)
            expect(types).toContain(EQUATION_TYPES.LINEAR)
            expect(types).toContain(EQUATION_TYPES.CUBIC)
            expect(types).toContain(EQUATION_TYPES.CIRCLE)
            expect(types).toContain(EQUATION_TYPES.EXPONENTIAL)
            expect(types).toContain(EQUATION_TYPES.LOGARITHMIC)
            expect(types).toContain(EQUATION_TYPES.SINE)
            expect(types).toContain(EQUATION_TYPES.COSINE)
        })
    })

    describe('EQUATION_DESCRIPTIONS', () => {
        it('should have descriptions for all main equation types', () => {
            const typesToCheck = [
                EQUATION_TYPES.LINEAR,
                EQUATION_TYPES.QUADRATIC,
                EQUATION_TYPES.CUBIC,
                EQUATION_TYPES.CIRCLE,
                EQUATION_TYPES.ELLIPSE,
                EQUATION_TYPES.HYPERBOLA,
                EQUATION_TYPES.EXPONENTIAL,
                EQUATION_TYPES.LOGARITHMIC,
                EQUATION_TYPES.SINE,
                EQUATION_TYPES.COSINE
            ]

            typesToCheck.forEach(type => {
                expect(EQUATION_DESCRIPTIONS[type]).toBeDefined()
            })
        })

        it('should have name, description, and standardForm for each type', () => {
            Object.values(EQUATION_DESCRIPTIONS).forEach(desc => {
                expect(desc).toHaveProperty('name')
                expect(desc).toHaveProperty('description')
                expect(desc).toHaveProperty('standardForm')
            })
        })
    })
})
