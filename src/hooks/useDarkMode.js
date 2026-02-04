import { useState, useEffect, useCallback } from 'react'

export const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(false)

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

    return { darkMode, toggleDarkMode }
}
