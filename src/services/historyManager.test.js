import { describe, it, expect } from 'vitest'
import { formatTimestamp } from '../services/historyManager'

/**
 * Simplified tests for historyManager
 * Full localStorage testing requires more complex mocking
 * These tests focus on the utility functions
 */

describe('historyManager', () => {
    describe('formatTimestamp', () => {
        it('should format recent timestamps as "Just now"', () => {
            const now = Date.now()
            expect(formatTimestamp(now)).toBe('Just now')
        })

        it('should format minutes ago', () => {
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
            expect(formatTimestamp(fiveMinutesAgo)).toBe('5m ago')
        })

        it('should format hours ago', () => {
            const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
            expect(formatTimestamp(twoHoursAgo)).toBe('2h ago')
        })

        it('should format days ago', () => {
            const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000
            expect(formatTimestamp(threeDaysAgo)).toBe('3d ago')
        })

        it('should handle null input', () => {
            expect(formatTimestamp(null)).toBe('Unknown')
        })

        it('should handle undefined input', () => {
            expect(formatTimestamp(undefined)).toBe('Unknown')
        })

        it('should handle NaN input', () => {
            expect(formatTimestamp(NaN)).toBe('Unknown')
        })
    })
})
