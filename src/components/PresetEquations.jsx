import React, { useState } from 'react'
import { PRESET_EQUATIONS } from '../utils/constants'

const PresetEquations = ({ onPresetSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    // Group presets by category
    const categories = {}
    PRESET_EQUATIONS.forEach(preset => {
        if (!categories[preset.category]) {
            categories[preset.category] = []
        }
        categories[preset.category].push(preset)
    })

    return (
        <div className="glass-card rounded-3xl p-6 mb-6 animate-slide-up">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between group"
            >
                <h3 className="text-lg font-semibold gradient-text flex items-center gap-2">
                    <span>📚</span>
                    <span>Preset Equations</span>
                    <span className="text-xs font-normal bg-gradient-to-r from-primary to-accent text-white px-2 py-1 rounded-full">
                        {PRESET_EQUATIONS.length}
                    </span>
                </h3>
                <svg
                    className={`w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="space-y-6">
                    {Object.entries(categories).map(([category, presets], categoryIndex) => (
                        <div key={category} className="animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                                {category}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {presets.map((preset, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onPresetSelect(preset.equation)}
                                        className="glass-button text-left p-4 rounded-2xl group relative overflow-hidden transition-all duration-300"
                                    >
                                        {/* Gradient overlay on hover - REMOVED interactions */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 transition-opacity"></div>

                                        <div className="relative">
                                            <p className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                                                {preset.label}
                                            </p>
                                            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg inline-block">
                                                {preset.equation}
                                            </p>
                                        </div>

                                        {/* Arrow icon - Always invisible if hover effect removed? Let's make it static visible or remove. User said remove *animations*. I'll remove the hover dependency. It was opacity-0. I'll make it always visible or remove it?
                                          If I remove `group-hover:opacity-100`, it stays `opacity-0`. Let's just remove the hover class.
                                        */}
                                        <svg className="absolute top-4 right-4 w-4 h-4 text-primary opacity-0 transform translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PresetEquations
