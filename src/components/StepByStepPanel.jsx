import React, { useState, useEffect } from 'react'
import { parseEquation } from '../services/equationParser'
import { classifyEquation } from '../services/equationClassifier'
import { generateSolution } from '../services/solutionGenerator'

const StepByStepPanel = ({ equation, parameters }) => {
    const [solution, setSolution] = useState(null)
    const [expandedSteps, setExpandedSteps] = useState({})
    const [isExpanded, setIsExpanded] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!equation) {
            setSolution(null)
            setError(null)
            return
        }

        try {
            const parsed = parseEquation(equation)
            if (!parsed.success) {
                setError('Unable to parse equation')
                setSolution(null)
                return
            }

            const type = classifyEquation(equation, parsed.data.node)
            const solutionData = generateSolution(type, parameters, equation)

            if (solutionData) {
                setSolution(solutionData)
                setError(null)
                // Auto-expand first step
                setExpandedSteps({ 0: true })
            } else {
                setError('Unable to generate solution steps')
                setSolution(null)
            }
        } catch (err) {
            console.error('Solution generation error:', err)
            setError('An error occurred while generating the solution')
            setSolution(null)
        }
    }, [equation, parameters])

    const toggleStep = (index) => {
        setExpandedSteps(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const expandAll = () => {
        if (!solution?.steps) return
        const allExpanded = {}
        solution.steps.forEach((_, index) => {
            allExpanded[index] = true
        })
        setExpandedSteps(allExpanded)
    }

    const collapseAll = () => {
        setExpandedSteps({})
    }

    if (!equation) {
        return null
    }

    if (error) {
        return (
            <div className="glass-card rounded-3xl p-6 animate-slide-up">
                <div className="flex items-center gap-2 text-red-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{error}</span>
                </div>
            </div>
        )
    }

    if (!solution) {
        return (
            <div className="glass-card rounded-3xl p-6 animate-slide-up">
                <div className="flex items-center gap-2 text-gray-500">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating solution...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card rounded-3xl p-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 group"
                >
                    <h3 className="text-xl font-semibold gradient-text flex items-center gap-2">
                        <span>📚</span>
                        <span>Step-by-Step Solution</span>
                    </h3>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isExpanded && (
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="text-xs glass-button px-3 py-1.5 rounded-lg font-medium transition-transform"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAll}
                            className="text-xs glass-button px-3 py-1.5 rounded-lg font-medium transition-transform"
                        >
                            Collapse All
                        </button>
                    </div>
                )}
            </div>

            {/* Title */}
            {isExpanded && (
                <>
                    <div className="mb-6 p-4 glass-card rounded-2xl border-2 border-primary/20">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {solution.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            Equation: {equation}
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                        {solution.steps.map((step, index) => (
                            <div
                                key={index}
                                className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${expandedSteps[index] ? 'ring-2 ring-primary/30' : ''
                                    }`}
                            >
                                {/* Step Header */}
                                <button
                                    onClick={() => toggleStep(index)}
                                    className="w-full p-4 flex items-center gap-4 text-left transition-colors"
                                >
                                    {/* Step Number */}
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                        ${expandedSteps[index]
                                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        }
                                        transition-all duration-300
                                    `}>
                                        {index + 1}
                                    </div>

                                    {/* Step Title */}
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {step.step}
                                        </span>
                                    </div>

                                    {/* Expand Icon */}
                                    <svg
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSteps[index] ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Step Content */}
                                <div className={`
                                    overflow-hidden transition-all duration-300
                                    ${expandedSteps[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                                        <div className="mt-4 space-y-3">
                                            {/* Explanation */}
                                            <div className="flex items-start gap-2">
                                                <span className="text-blue-500 mt-0.5">💡</span>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                    {step.explanation}
                                                </p>
                                            </div>

                                            {/* Formula */}
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 font-mono text-sm">
                                                <span className="text-gray-500 dark:text-gray-400 text-xs block mb-1">
                                                    Result:
                                                </span>
                                                <span className="text-primary dark:text-accent font-bold whitespace-pre-line">
                                                    {step.formula}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span>Steps Completed</span>
                            <span>{Object.keys(expandedSteps).filter(k => expandedSteps[k]).length} / {solution.steps.length}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                                style={{
                                    width: `${(Object.keys(expandedSteps).filter(k => expandedSteps[k]).length / solution.steps.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default StepByStepPanel
