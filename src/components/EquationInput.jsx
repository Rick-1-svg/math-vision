import React, { useState, useEffect } from 'react'
import { isValidEquation, sanitizeInput } from '../utils/validators'

const EquationInput = ({ onEquationSubmit, onEquationChange, initialValue = '' }) => {
    const [input, setInput] = useState(initialValue)
    const [error, setError] = useState(null)
    const [placeholderIndex, setPlaceholderIndex] = useState(0)

    useEffect(() => {
        setInput(initialValue || '')
        setError(null)
    }, [initialValue])

    const placeholders = [
        'x^2',
        'sin(x)',
        'e^x',
        '2*x + 3',
        'x^3 - 2*x',
        'cos(2*x)',
        'ln(x)'
    ]

    // Rotate placeholder every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    // Debounce input changes
    useEffect(() => {
        // Skip if empty or same as initial (avoids loops)
        if (!input.trim() || input === initialValue) return

        const timer = setTimeout(() => {
            validateAndSubmit(input, false)
        }, 500)

        return () => clearTimeout(timer)
    }, [input, initialValue])

    const validateAndSubmit = (value, isFinal = false) => {
        const sanitized = sanitizeInput(value)
        const validation = isValidEquation(sanitized)

        if (!validation.valid) {
            setError(validation.error)

            // Auto-correction: show suggestion but avoid auto-replacing text during type
            if (validation.corrected && validation.suggestion) {
                setError(`${validation.error}\n💡 ${validation.suggestion}`)
            }
            return
        }

        setError(null)

        // Live update
        if (onEquationChange) {
            onEquationChange(sanitized)
        }

        // Final submit (save history)
        if (isFinal) {
            onEquationSubmit(sanitized)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        validateAndSubmit(input, true)
    }

    const handleClear = () => {
        setInput('')
        setError(null)
        if (onEquationChange) onEquationChange(null)
        onEquationSubmit(null)
    }

    return (
        <div className="glass-card rounded-3xl p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">✏️</span>
                    <span className="gradient-text">Enter Your Equation</span>
                </h2>
                <div></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Try: ${placeholders[placeholderIndex]}`}
                        className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 font-mono text-lg
              ${error
                                ? 'border-red-500 focus:border-red-600 animate-shake'
                                : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                            }
              bg-white/50 dark:bg-[#0A0E27]/50 text-gray-900 dark:text-white
              backdrop-blur-sm
              focus:outline-none focus:scale-[1.02]
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              shadow-lg`}
                    />

                    {/* Input glow effect */}
                    {!error && input && (
                        <div className="absolute inset-0 rounded-2xl glow-primary opacity-50 pointer-events-none"></div>
                    )}

                    {error && (
                        <p className="mt-2 text-sm text-red-500 flex items-start animate-slide-up font-medium">
                            <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="whitespace-pre-line">{error}</span>
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 btn-gradient text-white px-6 py-4 rounded-2xl font-semibold text-lg
              shadow-lg
              focus:outline-none focus:ring-4 focus:ring-primary/30
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 group"
                        disabled={!input.trim()}
                    >
                        <span>🚀</span>
                        <span>Visualize</span>
                        <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-6 py-4 rounded-2xl glass-button text-gray-700 dark:text-gray-300 font-semibold
              shadow-lg
              focus:outline-none focus:ring-4 focus:ring-gray-400/30"
                    >
                        Clear
                    </button>
                </div>
            </form>

            <div className="mt-5 p-4 glass-card rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>Supported functions:</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400 font-mono font-medium">
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">+, -, *, /, ^</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">sin, cos, tan</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">log, ln, e, pi</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">sqrt, abs</span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-lg text-purple-700 dark:text-purple-300">z = f(x,y)</span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-lg text-purple-700 dark:text-purple-300">Circle/Ellipse</span>
                    <span className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg text-green-700 dark:text-green-300">Derivatives</span>
                    <span className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg text-green-700 dark:text-green-300">Integrals</span>
                </div>
            </div>
        </div>
    )
}

export default EquationInput
