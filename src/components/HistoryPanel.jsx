import React, { useState, useEffect } from 'react'
import {
    getHistory,
    getFavorites,
    removeFromHistory,
    clearHistory,
    toggleFavorite,
    search,
    formatTimestamp,
    exportData
} from '../services/historyManager'

const HistoryPanel = ({ onSelectEquation }) => {
    const [history, setHistory] = useState([])
    const [favorites, setFavorites] = useState([])
    const [activeTab, setActiveTab] = useState('history') // 'history' | 'favorites'
    const [searchQuery, setSearchQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const [error, setError] = useState(null)

    // Load data on mount
    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        try {
            setHistory(getHistory())
            setFavorites(getFavorites())
            setError(null)
        } catch (err) {
            console.error('Error loading history:', err)
            setError('Failed to load history')
        }
    }

    // Handle search
    useEffect(() => {
        if (searchQuery.trim()) {
            try {
                const results = search(searchQuery)
                setHistory(results.history)
                setFavorites(results.favorites)
            } catch (err) {
                console.error('Search error:', err)
            }
        } else {
            loadData()
        }
    }, [searchQuery])

    const handleSelect = (item) => {
        if (onSelectEquation) {
            onSelectEquation(item.equation)
        }
    }

    const handleToggleFavorite = (id, e) => {
        e.stopPropagation()
        try {
            const result = toggleFavorite(id)
            setHistory(result.history)
            setFavorites(result.favorites)
        } catch (err) {
            console.error('Toggle favorite error:', err)
            setError('Failed to update favorite')
        }
    }

    const handleRemove = (id, e) => {
        e.stopPropagation()
        try {
            const updatedHistory = removeFromHistory(id)
            setHistory(updatedHistory)
            setFavorites(getFavorites())
        } catch (err) {
            console.error('Remove error:', err)
            setError('Failed to remove item')
        }
    }

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear all history?')) {
            try {
                clearHistory()
                loadData()
            } catch (err) {
                console.error('Clear history error:', err)
                setError('Failed to clear history')
            }
        }
    }

    const handleExport = () => {
        try {
            const data = exportData()
            if (data) {
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'mathvision-history.json'
                a.click()
                URL.revokeObjectURL(url)
            }
        } catch (err) {
            console.error('Export error:', err)
            setError('Failed to export data')
        }
    }

    const getTypeIcon = (type) => {
        const icons = {
            linear: '📈',
            quadratic: '🎢',
            cubic: '〰️',
            circle: '⭕',
            ellipse: '🥚',
            hyperbola: '➰',
            exponential: '📊',
            logarithmic: '📉',
            sine: '🌊',
            cosine: '🌊',
            unknown: '❓'
        }
        return icons[type] || '📐'
    }

    const currentItems = activeTab === 'history' ? history : favorites

    return (
        <div className="glass-card rounded-3xl overflow-hidden animate-slide-up">
            {/* Header - Always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl">📜</span>
                    <h3 className="text-lg font-semibold gradient-text">
                        History & Favorites
                    </h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                        {history.length} saved
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded Content */}
            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {/* Error Message */}
                {error && (
                    <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'history'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        History ({history.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'favorites'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        ⭐ Favorites ({favorites.length})
                    </button>
                </div>

                {/* Search & Actions */}
                <div className="p-4 flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search equations..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                                bg-white/50 dark:bg-gray-800/50 text-sm
                                focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button
                        onClick={handleExport}
                        className="p-2 glass-button rounded-xl hover:scale-105 transition-transform"
                        title="Export"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                    {activeTab === 'history' && history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="p-2 glass-button rounded-xl hover:scale-105 transition-transform text-red-500"
                            title="Clear History"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Items List */}
                <div className="px-4 pb-4 max-h-80 overflow-y-auto custom-scrollbar">
                    {currentItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p className="text-3xl mb-2">{activeTab === 'history' ? '📭' : '⭐'}</p>
                            <p className="text-sm">
                                {activeTab === 'history'
                                    ? 'No equations in history yet'
                                    : 'No favorite equations yet'}
                            </p>
                            <p className="text-xs mt-1 text-gray-400">
                                {activeTab === 'history'
                                    ? 'Start visualizing equations to see them here'
                                    : 'Click the star icon to save favorites'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="group p-3 glass-card rounded-xl cursor-pointer 
                                        hover:ring-2 hover:ring-primary/30 transition-all
                                        flex items-center gap-3"
                                >
                                    {/* Type Icon */}
                                    <span className="text-xl">{getTypeIcon(item.type)}</span>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {item.equation}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.type} • {formatTimestamp(item.timestamp)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleToggleFavorite(item.id, e)}
                                            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${item.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                                                }`}
                                            title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            <svg className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleRemove(item.id, e)}
                                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HistoryPanel
