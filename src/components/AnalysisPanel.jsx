import React, { useEffect, useState } from 'react'
import { parseEquation } from '../services/equationParser'
import { classifyEquation } from '../services/equationClassifier'
import { calculateProperties } from '../services/propertyCalculator'
import { EQUATION_DESCRIPTIONS } from '../utils/constants'

const AnalysisPanel = ({ equation, parameters }) => {
    const [analysis, setAnalysis] = useState(null)

    useEffect(() => {
        if (!equation) {
            setAnalysis(null)
            return
        }

        const analyzeEquation = () => {
            try {
                // Parse and classify
                const parsed = parseEquation(equation)
                if (!parsed.success) return

                const type = classifyEquation(equation, parsed.data.node)
                const properties = calculateProperties(type, parameters)
                const description = EQUATION_DESCRIPTIONS[type] || {}

                setAnalysis({
                    type,
                    properties,
                    description
                })
            } catch (error) {
                console.error('Analysis error:', error)
            }
        }

        analyzeEquation()
    }, [equation, parameters])

    if (!analysis) return null

    const { type, properties = {}, description = {} } = analysis

    return (
        <div className="glass-card rounded-3xl p-6 animate-slide-up hover-lift">
            <h3 className="text-xl font-semibold mb-6 gradient-text flex items-center gap-2">
                <span>📊</span>
                <span>Equation Analysis</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-children">
                {/* Equation Type */}
                <div className="relative overflow-hidden glass-card rounded-2xl p-5 border-2 border-primary/20 hover:border-primary/40 transition-all group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide relative">
                        Equation Type
                    </h4>
                    <p className="text-2xl font-bold gradient-text mb-2 relative">
                        {description.name || type || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg inline-block relative">
                        {description.standardForm || 'N/A'}
                    </p>
                </div>

                {/* Properties */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-5">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                        <span>🔍</span>
                        <span>Mathematical Properties</span>
                    </h4>
                    {properties && Object.keys(properties).length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(properties).map(([key, value], index) => (
                                <div
                                    key={key}
                                    className="glass-card rounded-xl p-3 hover:scale-105 transition-transform group"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize font-medium">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white font-mono group-hover:text-primary transition-colors">
                                        {value ?? 'N/A'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No properties available
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="lg:col-span-3 relative overflow-hidden glass-card rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-800/50">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer"></div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>About This Equation</span>
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {description.description || 'No description available for this equation type.'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default React.memo(AnalysisPanel, (prevProps, nextProps) => {
    if (prevProps.equation !== nextProps.equation) return false

    // Deep compare parameters array
    if (prevProps.parameters && nextProps.parameters) {
        if (prevProps.parameters.length !== nextProps.parameters.length) return false
        for (let i = 0; i < prevProps.parameters.length; i++) {
            if (prevProps.parameters[i].value !== nextProps.parameters[i].value) return false
            if (prevProps.parameters[i].name !== nextProps.parameters[i].name) return false
        }
    } else if (prevProps.parameters !== nextProps.parameters) {
        return false // One is null/undefined
    }

    return true
})
