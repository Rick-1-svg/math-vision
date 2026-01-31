import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import EquationInput from './components/EquationInput'
import GraphPanel from './components/GraphPanelOptimized'
import ParameterSliders from './components/ParameterSliders'
import AnalysisPanel from './components/AnalysisPanel'
import CalculusPanel from './components/CalculusPanel'
import PresetEquations from './components/PresetEquations'
import StepByStepPanel from './components/StepByStepPanel'
import HistoryPanel from './components/HistoryPanel'
import PracticeMode from './components/PracticeMode'
import EquationList from './components/EquationList'
import { useEquationManager } from './hooks/useEquationManager'

function App() {
    const [darkMode, setDarkMode] = useState(false)
    const {
        equations,
        activeId,
        activeEquation,
        setActiveId,
        addEquation,
        removeEquation,
        updateEquation,
        updateParameters,
        updateFeatures,
        toggleVisibility
    } = useEquationManager()

    // Load dark mode preference from localStorage
    useEffect(() => {
        try {
            const savedDarkMode = localStorage.getItem('darkMode') === 'true'
            setDarkMode(savedDarkMode)
            if (savedDarkMode) {
                document.body.classList.add('dark')
            }
        } catch (err) {
            console.error('Error loading dark mode preference:', err)
        }
    }, [])

    // Toggle dark mode
    const toggleDarkMode = useCallback(() => {
        try {
            const newDarkMode = !darkMode
            setDarkMode(newDarkMode)
            document.body.classList.toggle('dark')
            localStorage.setItem('darkMode', newDarkMode.toString())
        } catch (err) {
            console.error('Error saving dark mode preference:', err)
        }
    }, [darkMode])

    // Handle equation submission
    const handleEquationSubmit = useCallback((equationString) => {
        updateEquation(activeId, equationString)
    }, [activeId, updateEquation])

    // Handle history/practice equation selection
    const handleSelectEquation = useCallback((equationString) => {
        // If current equation is empty, use it. Otherwise add new one?
        // For simplicity, just update current active one
        handleEquationSubmit(equationString)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [handleEquationSubmit])

    const handleParameterChange = useCallback((newParams) => {
        updateParameters(activeId, newParams)
    }, [activeId, updateParameters])

    return (
        <div className="min-h-screen transition-colors duration-300 custom-scrollbar">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Top Section: Input and Presets */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <EquationInput
                                onEquationSubmit={handleEquationSubmit}
                                initialValue={activeEquation?.text || ''}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-full flex items-center">
                                <PresetEquations onPresetSelect={handleEquationSubmit} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Equations, Parameters, Tools */}
                    <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">

                        {/* Equation List Manager */}
                        <EquationList
                            equations={equations}
                            activeId={activeId}
                            setActiveId={setActiveId}
                            addEquation={addEquation}
                            removeEquation={removeEquation}
                            toggleVisibility={toggleVisibility}
                        />

                        {/* Parameter Sliders */}
                        {activeEquation && activeEquation.parameters && activeEquation.parameters.length > 0 && (
                            <ParameterSliders
                                parameters={activeEquation.parameters}
                                onParameterChange={handleParameterChange}
                            />
                        )}

                        {/* Calculus Tools */}
                        <CalculusPanel
                            activeEquation={activeEquation}
                            updateFeatures={updateFeatures}
                        />

                        {/* Practice Mode */}
                        <PracticeMode onSelectEquation={handleSelectEquation} />

                        {/* History & Favorites */}
                        <HistoryPanel onSelectEquation={handleSelectEquation} />
                    </div>

                    {/* Right Column: Graph */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <GraphPanel
                            equations={equations}
                            activeId={activeId}
                        />
                    </div>
                </div>

                {/* Analysis Section - Full Width (Active Equation) */}
                {activeEquation && activeEquation.text && !activeEquation.error && (
                    <div className="mt-8 space-y-6">
                        {/* Step-by-Step Solutions */}
                        <StepByStepPanel
                            equation={activeEquation.text}
                            parameters={activeEquation.parameters}
                        />

                        {/* Mathematical Analysis */}
                        <AnalysisPanel
                            equation={activeEquation.text}
                            parameters={activeEquation.parameters}
                        />
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 py-8 glass-card border-t-0 rounded-t-3xl animate-fade-in">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl animate-pulse-slow">❤️</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Built with passion for <span className="font-semibold gradient-text">Hackathon 2026</span>
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        Visualize • Explore • Understand Mathematics
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                        ✨ Now with Multi-Equation Support, Optimization, and Practice Mode
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default App
