import React from 'react'

const Header = ({ darkMode, toggleDarkMode }) => {
    return (
        <header className="glass-card sticky top-0 z-50 border-b-0 animate-fade-in">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center
              shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                                Maths Vision
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                Interactive Equation Visualizer
                            </p>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="relative p-3 rounded-2xl glass-button group overflow-hidden"
                        aria-label="Toggle dark mode"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                        {/* Icon container with rotation */}
                        <div className="relative transform transition-transform duration-500 group-hover:rotate-180">
                            {darkMode ? (
                                // Sun icon for light mode
                                <svg className="w-6 h-6 text-yellow-500 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                // Moon icon for dark mode
                                <svg className="w-6 h-6 text-indigo-600 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </div>

                        {/* Glow effect on hover */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'glow-primary' : 'glow-accent'
                            }`}></div>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
