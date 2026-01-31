import React from 'react'

const CalculusPanel = ({ activeEquation, updateFeatures }) => {
    if (!activeEquation) return null

    const { features, type, id } = activeEquation

    // Only enable for 2D explicit functions for now
    // THREE_D, IMPLICIT (Circle, Ellipse) might be tricky for simple calculus visualization
    // Let's support GENERAL, LINEAR, QUADRATIC, CUBIC, POLYNOMIAL, EXPONENTIAL, LOGARITHMIC, SINE, COSINE, TANGENT
    const supportedTypes = [
        'GENERAL', 'LINEAR', 'QUADRATIC', 'CUBIC', 'POLYNOMIAL',
        'EXPONENTIAL', 'LOGARITHMIC', 'SINE', 'COSINE', 'TANGENT', 'trig'
    ]

    // Check if type is supported (or if it is just a generic function not flagged as 3D/implicit)
    const isSupported = type !== 'three_d' && type !== 'CIRCLE' && type !== 'ELLIPSE' && type !== 'HYPERBOLA'

    if (!isSupported) {
        return (
            <div className="glass-card rounded-3xl p-6 animate-slide-up opacity-50 pointer-events-none grayscale">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold gradient-text">Calculus Tools</h3>
                </div>
                <p className="text-sm text-gray-500">
                    Calculus tools are only available for explicit 2D functions (y = f(x)).
                </p>
            </div>
        )
    }

    const handleFeatureChange = (key, value) => {
        updateFeatures(id, { [key]: value })
    }

    const handleIntegralRangeChange = (key, value) => {
        const newRange = { ...features.integralRange, [key]: parseFloat(value) || 0 }
        updateFeatures(id, { integralRange: newRange })
    }

    return (
        <div className="glass-card rounded-3xl p-6 animate-slide-up mb-6">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">∫</span>
                <h3 className="text-lg font-semibold gradient-text">Calculus Tools</h3>
            </div>

            <div className="space-y-6">
                {/* Derivative */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">Derivative</div>
                        <div className="text-xs text-gray-500">Plot f'(x) slope</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={features?.showDerivative || false}
                            onChange={(e) => handleFeatureChange('showDerivative', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                {/* Roots */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">Find Roots</div>
                        <div className="text-xs text-gray-500">Show X-Intercepts</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={features?.showRoots || false}
                            onChange={(e) => handleFeatureChange('showRoots', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                {/* Integral */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">Definite Integral</div>
                            <div className="text-xs text-gray-500">Area under curve</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={features?.showIntegral || false}
                                onChange={(e) => handleFeatureChange('showIntegral', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {features?.showIntegral && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">From (a)</label>
                                <input
                                    type="number"
                                    value={features.integralRange?.min ?? 0}
                                    onChange={(e) => handleIntegralRangeChange('min', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">To (b)</label>
                                <input
                                    type="number"
                                    value={features.integralRange?.max ?? 2}
                                    onChange={(e) => handleIntegralRangeChange('max', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CalculusPanel
