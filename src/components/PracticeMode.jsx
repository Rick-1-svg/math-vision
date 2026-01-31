import React, { useState, useEffect, useCallback } from 'react'
import {
    practiceProblems,
    DIFFICULTY_LEVELS,
    CATEGORIES,
    getProblems,
    validateAnswer
} from '../data/practiceProblems'

const PracticeMode = ({ onSelectEquation }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [category, setCategory] = useState(CATEGORIES.ALL)
    const [difficulty, setDifficulty] = useState(null)
    const [currentProblem, setCurrentProblem] = useState(null)
    const [userAnswer, setUserAnswer] = useState('')
    const [showHint, setShowHint] = useState(false)
    const [hintIndex, setHintIndex] = useState(0)
    const [result, setResult] = useState(null)
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const [problemsSolved, setProblemsSolved] = useState(0)
    const [error, setError] = useState(null)

    // Load progress from localStorage
    useEffect(() => {
        try {
            const savedScore = localStorage.getItem('mathvision_practice_score')
            const savedStreak = localStorage.getItem('mathvision_practice_streak')
            const savedSolved = localStorage.getItem('mathvision_practice_solved')

            if (savedScore) setScore(parseInt(savedScore, 10))
            if (savedStreak) setStreak(parseInt(savedStreak, 10))
            if (savedSolved) setProblemsSolved(parseInt(savedSolved, 10))
        } catch (err) {
            console.error('Error loading practice progress:', err)
        }
    }, [])

    // Save progress
    const saveProgress = useCallback((newScore, newStreak, newSolved) => {
        try {
            localStorage.setItem('mathvision_practice_score', newScore.toString())
            localStorage.setItem('mathvision_practice_streak', newStreak.toString())
            localStorage.setItem('mathvision_practice_solved', newSolved.toString())
        } catch (err) {
            console.error('Error saving progress:', err)
        }
    }, [])

    // Get a random problem
    const getRandomProblem = useCallback(() => {
        try {
            const problems = getProblems(category, difficulty)
            if (problems.length === 0) {
                setError('No problems found for this category/difficulty')
                return null
            }
            const randomIndex = Math.floor(Math.random() * problems.length)
            return problems[randomIndex]
        } catch (err) {
            console.error('Error getting problem:', err)
            setError('Failed to load problem')
            return null
        }
    }, [category, difficulty])

    // Start a new problem
    const startNewProblem = () => {
        const problem = getRandomProblem()
        if (problem) {
            setCurrentProblem(problem)
            setUserAnswer('')
            setShowHint(false)
            setHintIndex(0)
            setResult(null)
            setError(null)

            // Show the equation in the graph
            if (onSelectEquation && problem.equation) {
                onSelectEquation(problem.equation)
            }
        }
    }

    // Check the answer
    const checkAnswer = () => {
        if (!currentProblem || !userAnswer.trim()) return

        try {
            const validation = validateAnswer(currentProblem.id, userAnswer)
            setResult(validation)

            if (validation.correct) {
                const newScore = score + validation.points
                const newStreak = streak + 1
                const newSolved = problemsSolved + 1

                setScore(newScore)
                setStreak(newStreak)
                setProblemsSolved(newSolved)
                saveProgress(newScore, newStreak, newSolved)
            } else {
                setStreak(0)
                saveProgress(score, 0, problemsSolved)
            }
        } catch (err) {
            console.error('Error checking answer:', err)
            setError('Failed to check answer')
        }
    }

    // Show next hint
    const showNextHint = () => {
        if (currentProblem && hintIndex < currentProblem.hints.length) {
            setShowHint(true)
            setHintIndex(prev => Math.min(prev + 1, currentProblem.hints.length))
        }
    }

    // Skip problem
    const skipProblem = () => {
        setStreak(0)
        saveProgress(score, 0, problemsSolved)
        startNewProblem()
    }

    // Reset progress
    const resetProgress = () => {
        if (window.confirm('Are you sure you want to reset all progress?')) {
            setScore(0)
            setStreak(0)
            setProblemsSolved(0)
            saveProgress(0, 0, 0)
        }
    }

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case DIFFICULTY_LEVELS.EASY: return 'text-green-500 bg-green-100 dark:bg-green-900/30'
            case DIFFICULTY_LEVELS.MEDIUM: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
            case DIFFICULTY_LEVELS.HARD: return 'text-red-500 bg-red-100 dark:bg-red-900/30'
            default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800'
        }
    }

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case CATEGORIES.POLYNOMIALS: return '📊'
            case CATEGORIES.CONICS: return '⭕'
            case CATEGORIES.TRIGONOMETRY: return '🌊'
            case CATEGORIES.EXPONENTIALS: return '📈'
            case CATEGORIES.ALL: return '🎯'
            default: return '📐'
        }
    }

    return (
        <div className="glass-card rounded-3xl overflow-hidden animate-slide-up">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎮</span>
                    <h3 className="text-lg font-semibold gradient-text">
                        Practice Mode
                    </h3>
                    {streak > 0 && (
                        <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">
                            🔥 {streak} streak
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                        {score} pts
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded Content */}
            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {/* Error Display */}
                {error && (
                    <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">×</button>
                    </div>
                )}

                {/* Stats Bar */}
                <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                    <div className="glass-card rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold gradient-text">{score}</p>
                        <p className="text-xs text-gray-500">Total Points</p>
                    </div>
                    <div className="glass-card rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-orange-500">{streak}</p>
                        <p className="text-xs text-gray-500">Current Streak</p>
                    </div>
                    <div className="glass-card rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-green-500">{problemsSolved}</p>
                        <p className="text-xs text-gray-500">Problems Solved</p>
                    </div>
                </div>

                {/* Filters */}
                {!currentProblem && (
                    <div className="px-4 pb-4 space-y-3">
                        {/* Category Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(CATEGORIES).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${category === cat
                                                ? 'bg-primary text-white'
                                                : 'glass-button hover:scale-105'
                                            }`}
                                    >
                                        {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                Difficulty
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDifficulty(null)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${difficulty === null
                                            ? 'bg-primary text-white'
                                            : 'glass-button hover:scale-105'
                                        }`}
                                >
                                    All Levels
                                </button>
                                {Object.values(DIFFICULTY_LEVELS).map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setDifficulty(diff)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${difficulty === diff
                                                ? 'bg-primary text-white'
                                                : 'glass-button hover:scale-105'
                                            }`}
                                    >
                                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={startNewProblem}
                            className="w-full btn-gradient text-white py-4 rounded-2xl font-semibold text-lg
                                shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                        >
                            <span>🚀</span>
                            <span>Start Practice</span>
                        </button>

                        {/* Reset Progress */}
                        {problemsSolved > 0 && (
                            <button
                                onClick={resetProgress}
                                className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
                            >
                                Reset Progress
                            </button>
                        )}
                    </div>
                )}

                {/* Problem Display */}
                {currentProblem && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Problem Header */}
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
                                {currentProblem.difficulty.toUpperCase()} • {currentProblem.points} pts
                            </span>
                            <span className="text-sm text-gray-500">
                                {getCategoryIcon(currentProblem.category)} {currentProblem.category}
                            </span>
                        </div>

                        {/* Equation Display */}
                        <div className="glass-card rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Equation</p>
                            <p className="font-mono text-lg font-bold text-primary">
                                y = {currentProblem.equation}
                            </p>
                        </div>

                        {/* Question */}
                        <div className="glass-card rounded-xl p-4 border-2 border-primary/20">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {currentProblem.question}
                            </p>
                        </div>

                        {/* Hints */}
                        {showHint && hintIndex > 0 && (
                            <div className="space-y-2">
                                {currentProblem.hints.slice(0, hintIndex).map((hint, i) => (
                                    <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-sm border border-blue-200 dark:border-blue-800">
                                        <span className="text-blue-500 font-medium">Hint {i + 1}:</span>{' '}
                                        <span className="text-gray-700 dark:text-gray-300">{hint}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Answer Input */}
                        {!result && (
                            <>
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                                    placeholder="Enter your answer..."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
                                        bg-white/50 dark:bg-gray-800/50 font-mono
                                        focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    autoFocus
                                />

                                <div className="flex gap-2">
                                    <button
                                        onClick={checkAnswer}
                                        disabled={!userAnswer.trim()}
                                        className="flex-1 btn-gradient text-white py-3 rounded-xl font-semibold
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Check Answer
                                    </button>
                                    {hintIndex < currentProblem.hints.length && (
                                        <button
                                            onClick={showNextHint}
                                            className="px-4 py-3 glass-button rounded-xl font-medium"
                                        >
                                            💡 Hint
                                        </button>
                                    )}
                                    <button
                                        onClick={skipProblem}
                                        className="px-4 py-3 glass-button rounded-xl font-medium text-gray-500"
                                    >
                                        Skip
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Result Display */}
                        {result && (
                            <div className={`rounded-xl p-4 ${result.correct
                                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                    : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {result.correct ? (
                                        <>
                                            <span className="text-2xl">🎉</span>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                Correct! +{result.points} points
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl">😔</span>
                                            <span className="font-bold text-red-600 dark:text-red-400">
                                                Incorrect
                                            </span>
                                        </>
                                    )}
                                </div>

                                {!result.correct && (
                                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                                        <span className="font-medium">Correct answer:</span> {result.correctAnswer}
                                    </p>
                                )}

                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Explanation:</span> {result.explanation}
                                </p>

                                <button
                                    onClick={startNewProblem}
                                    className="mt-4 w-full btn-gradient text-white py-3 rounded-xl font-semibold"
                                >
                                    Next Problem →
                                </button>
                            </div>
                        )}

                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setCurrentProblem(null)
                                setResult(null)
                            }}
                            className="w-full text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                            ← Back to categories
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PracticeMode
