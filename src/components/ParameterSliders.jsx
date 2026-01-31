import React from 'react'

const ParameterSliders = ({ parameters, onParameterChange }) => {
    const handleSliderChange = (index, newValue) => {
        const updated = [...parameters]
        updated[index] = { ...updated[index], value: parseFloat(newValue) }
        onParameterChange(updated)
    }

    const handleReset = () => {
        const reset = parameters.map(p => ({ ...p, value: p.default }))
        onParameterChange(reset)
    }

    if (!parameters || parameters.length === 0) return null

    return (
        <div className="glass-card rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold gradient-text flex items-center gap-2">
                    <span>🎛️</span>
                    <span>Parameters</span>
                </h3>
                <button
                    onClick={handleReset}
                    className="text-sm glass-button px-4 py-2 rounded-xl font-medium group"
                >
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                    </span>
                </button>
            </div>

            <div className="space-y-5 stagger-children">
                {parameters.map((param, index) => (
                    <div key={param.name} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {param.label}
                            </label>
                            <span className="text-sm font-mono font-bold bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-xl shadow-lg transition-transform">
                                {param.value.toFixed(2)}
                            </span>
                        </div>

                        <div className="relative">
                            {/* Custom range input */}
                            <input
                                type="range"
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                value={param.value}
                                onChange={(e) => handleSliderChange(index, e.target.value)}
                                className="slider w-full h-3 rounded-full appearance-none cursor-pointer
                  bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600
                  focus:outline-none focus:ring-4 focus:ring-primary/30
                  transition-all duration-300"
                                style={{
                                    background: `linear-gradient(to right, 
                    #2D5BFF 0%, 
                    #00D9FF ${((param.value - param.min) / (param.max - param.min)) * 100}%, 
                    #e5e7eb ${((param.value - param.min) / (param.max - param.min)) * 100}%, 
                    #e5e7eb 100%)`
                                }}
                            />

                            {/* Glow effect - REMOVED interactions */}
                            <div className="absolute inset-0 rounded-full glow-primary opacity-0 transition-opacity pointer-events-none"></div>
                        </div>

                        {/* Min/Max labels */}
                        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                            <span>{param.min}</span>
                            <span>{param.max}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ParameterSliders
