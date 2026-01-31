import React from 'react'

const EquationList = ({
    equations,
    activeId,
    setActiveId,
    removeEquation,
    addEquation,
    toggleVisibility
}) => {
    const is3DMode = equations.some(eq => eq.type === 'three_d')

    return (
        <div className="glass-card rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold gradient-text flex items-center gap-2">
                    <span>📝</span>
                    <span>Equations</span>
                </h3>
                <div className="relative group/add">
                    <button
                        onClick={addEquation}
                        disabled={is3DMode}
                        className={`p-2 rounded-xl transition-all duration-300 ${is3DMode
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                            : 'glass-button text-primary'}`}
                        title={is3DMode ? "Can't add equations in 3D view" : "Add Equation"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    {is3DMode && (
                        <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover/add:opacity-100 transition-opacity pointer-events-none z-10 text-center font-medium">
                            Can't add equations in 3D view
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {equations.map((eq) => (
                    <div
                        key={eq.id}
                        className={`
                            group relative p-3 rounded-2xl transition-all duration-300 border-2 cursor-pointer
                            ${eq.id === activeId
                                ? 'bg-primary/10 border-primary/50 shadow-lg'
                                : 'bg-white/5 border-transparent'}
                        `}
                        onClick={() => setActiveId(eq.id)}
                    >
                        <div className="flex items-center gap-3">
                            {/* Color Indicator / Visibility Toggle */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleVisibility(eq.id)
                                }}
                                className="w-4 h-4 rounded-full transition-transform flex-shrink-0"
                                style={{
                                    backgroundColor: eq.visible ? eq.color : 'transparent',
                                    border: `2px solid ${eq.color}`,
                                    opacity: eq.visible ? 1 : 0.5
                                }}
                                title={eq.visible ? "Hide" : "Show"}
                            />

                            {/* Equation Text */}
                            <div className="flex-1 min-w-0">
                                <div className={`font-mono text-sm truncate ${!eq.text ? 'text-gray-400 italic' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {eq.text || 'Empty Equation'}
                                </div>
                                {eq.error && (
                                    <div className="text-xs text-red-500 truncate mt-1">
                                        {eq.error}
                                    </div>
                                )}
                            </div>

                            {/* Delete Button */}
                            {equations.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeEquation(eq.id)
                                    }}
                                    className="p-1.5 rounded-lg text-gray-400 transition-all duration-300"
                                    title="Remove"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Active Indicator */}
                        {eq.id === activeId && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EquationList
