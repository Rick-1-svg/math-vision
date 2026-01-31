/**
 * History Manager Service
 * Manages equation history and favorites using localStorage
 * @module services/historyManager
 */

const HISTORY_KEY = 'mathvision_history'
const FAVORITES_KEY = 'mathvision_favorites'
const MAX_HISTORY_SIZE = 20
const MAX_FAVORITES_SIZE = 50

/**
 * Get all history items
 * @returns {Array} Array of history items
 */
export const getHistory = () => {
    try {
        const stored = localStorage.getItem(HISTORY_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Error reading history:', error)
        return []
    }
}

/**
 * Get all favorite items
 * @returns {Array} Array of favorite items
 */
export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Error reading favorites:', error)
        return []
    }
}

/**
 * Add equation to history
 * @param {Object} item - { equation, type, parameters, timestamp }
 * @returns {Array} Updated history
 */
export const addToHistory = (item) => {
    try {
        const history = getHistory()

        // Create new entry
        const newEntry = {
            id: generateId(),
            equation: item.equation,
            type: item.type || 'unknown',
            parameters: item.parameters || [],
            timestamp: Date.now(),
            isFavorite: false
        }

        // Check for duplicate (same equation)
        const existingIndex = history.findIndex(h => h.equation === item.equation)
        if (existingIndex !== -1) {
            // Update existing entry's timestamp
            history[existingIndex].timestamp = Date.now()
            // Move to top
            const [existing] = history.splice(existingIndex, 1)
            history.unshift(existing)
        } else {
            // Add to beginning
            history.unshift(newEntry)

            // Limit history size
            if (history.length > MAX_HISTORY_SIZE) {
                // Remove oldest non-favorite items first
                const toRemove = history.length - MAX_HISTORY_SIZE
                let removed = 0
                for (let i = history.length - 1; i >= 0 && removed < toRemove; i--) {
                    if (!history[i].isFavorite) {
                        history.splice(i, 1)
                        removed++
                    }
                }
            }
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
        return history
    } catch (error) {
        console.error('Error adding to history:', error)
        return getHistory()
    }
}

/**
 * Remove item from history
 * @param {string} id - Item ID to remove
 * @returns {Array} Updated history
 */
export const removeFromHistory = (id) => {
    try {
        let history = getHistory()
        history = history.filter(item => item.id !== id)
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))

        // Also remove from favorites if present
        let favorites = getFavorites()
        favorites = favorites.filter(item => item.id !== id)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

        return history
    } catch (error) {
        console.error('Error removing from history:', error)
        return getHistory()
    }
}

/**
 * Clear all history
 * @returns {Array} Empty array
 */
export const clearHistory = () => {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
        return []
    } catch (error) {
        console.error('Error clearing history:', error)
        return []
    }
}

/**
 * Toggle favorite status for an item
 * @param {string} id - Item ID
 * @returns {Object} { history, favorites }
 */
export const toggleFavorite = (id) => {
    try {
        const history = getHistory()
        const favorites = getFavorites()

        const historyItem = history.find(item => item.id === id)
        if (!historyItem) {
            return { history, favorites }
        }

        const favoriteIndex = favorites.findIndex(f => f.id === id)

        if (favoriteIndex !== -1) {
            // Remove from favorites
            favorites.splice(favoriteIndex, 1)
            historyItem.isFavorite = false
        } else {
            // Add to favorites
            if (favorites.length >= MAX_FAVORITES_SIZE) {
                favorites.pop() // Remove oldest
            }
            favorites.unshift({ ...historyItem, isFavorite: true })
            historyItem.isFavorite = true
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

        return { history, favorites }
    } catch (error) {
        console.error('Error toggling favorite:', error)
        return { history: getHistory(), favorites: getFavorites() }
    }
}

/**
 * Add directly to favorites
 * @param {Object} item - Item to add
 * @returns {Array} Updated favorites
 */
export const addToFavorites = (item) => {
    try {
        let favorites = getFavorites()

        const newEntry = {
            id: item.id || generateId(),
            equation: item.equation,
            type: item.type || 'unknown',
            parameters: item.parameters || [],
            timestamp: Date.now(),
            isFavorite: true
        }

        // Check for duplicate
        const existingIndex = favorites.findIndex(f => f.equation === item.equation)
        if (existingIndex === -1) {
            favorites.unshift(newEntry)

            if (favorites.length > MAX_FAVORITES_SIZE) {
                favorites.pop()
            }

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
        }

        return favorites
    } catch (error) {
        console.error('Error adding to favorites:', error)
        return getFavorites()
    }
}

/**
 * Remove from favorites
 * @param {string} id - Item ID
 * @returns {Array} Updated favorites
 */
export const removeFromFavorites = (id) => {
    try {
        let favorites = getFavorites()
        favorites = favorites.filter(item => item.id !== id)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

        // Update history item
        const history = getHistory()
        const historyItem = history.find(item => item.id === id)
        if (historyItem) {
            historyItem.isFavorite = false
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
        }

        return favorites
    } catch (error) {
        console.error('Error removing from favorites:', error)
        return getFavorites()
    }
}

/**
 * Clear all favorites
 * @returns {Array} Empty array
 */
export const clearFavorites = () => {
    try {
        // Update history items
        const history = getHistory()
        history.forEach(item => {
            item.isFavorite = false
        })
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))

        localStorage.setItem(FAVORITES_KEY, JSON.stringify([]))
        return []
    } catch (error) {
        console.error('Error clearing favorites:', error)
        return []
    }
}

/**
 * Search history and favorites
 * @param {string} query - Search query
 * @returns {Object} { history, favorites }
 */
export const search = (query) => {
    try {
        const normalizedQuery = query.toLowerCase().trim()
        if (!normalizedQuery) {
            return { history: getHistory(), favorites: getFavorites() }
        }

        const history = getHistory().filter(item =>
            item.equation.toLowerCase().includes(normalizedQuery) ||
            item.type.toLowerCase().includes(normalizedQuery)
        )

        const favorites = getFavorites().filter(item =>
            item.equation.toLowerCase().includes(normalizedQuery) ||
            item.type.toLowerCase().includes(normalizedQuery)
        )

        return { history, favorites }
    } catch (error) {
        console.error('Error searching:', error)
        return { history: [], favorites: [] }
    }
}

/**
 * Export history and favorites as JSON
 * @returns {string} JSON string
 */
export const exportData = () => {
    try {
        const data = {
            history: getHistory(),
            favorites: getFavorites(),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        }
        return JSON.stringify(data, null, 2)
    } catch (error) {
        console.error('Error exporting data:', error)
        return null
    }
}

/**
 * Import history and favorites from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {Object} { success, history, favorites, error }
 */
export const importData = (jsonString) => {
    try {
        const data = JSON.parse(jsonString)

        if (!data.history || !Array.isArray(data.history)) {
            return { success: false, error: 'Invalid data format: missing history array' }
        }

        // Validate and merge history
        const existingHistory = getHistory()
        const existingFavorites = getFavorites()

        data.history.forEach(item => {
            if (item.equation && !existingHistory.find(h => h.equation === item.equation)) {
                existingHistory.push({
                    ...item,
                    id: item.id || generateId(),
                    timestamp: item.timestamp || Date.now()
                })
            }
        })

        if (data.favorites && Array.isArray(data.favorites)) {
            data.favorites.forEach(item => {
                if (item.equation && !existingFavorites.find(f => f.equation === item.equation)) {
                    existingFavorites.push({
                        ...item,
                        id: item.id || generateId(),
                        isFavorite: true,
                        timestamp: item.timestamp || Date.now()
                    })
                }
            })
        }

        // Limit sizes
        const history = existingHistory.slice(0, MAX_HISTORY_SIZE)
        const favorites = existingFavorites.slice(0, MAX_FAVORITES_SIZE)

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

        return { success: true, history, favorites }
    } catch (error) {
        console.error('Error importing data:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format timestamp for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted string
 */
export const formatTimestamp = (timestamp) => {
    // Handle null/undefined/NaN
    if (timestamp === null || timestamp === undefined || Number.isNaN(timestamp)) {
        return 'Unknown'
    }

    try {
        const date = new Date(timestamp)
        // Check for invalid date
        if (isNaN(date.getTime())) {
            return 'Unknown'
        }

        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`

        return date.toLocaleDateString()
    } catch (error) {
        return 'Unknown'
    }
}

export default {
    getHistory,
    getFavorites,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    search,
    exportData,
    importData,
    formatTimestamp
}
