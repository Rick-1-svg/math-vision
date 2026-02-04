import { useState, useCallback } from 'react'
import { parseEquation } from '../services/equationParser'
import { classifyEquation, extractParameters } from '../services/equationClassifier'
import { addToHistory } from '../services/historyManager'

const COLORS = [
    '#2D5BFF', // Blue
    '#FF2D55', // Red
    '#00D9FF', // Cyan
    '#FFCC00', // Yellow
    '#AF52DE', // Purple
    '#34C759'  // Green
]

export const useEquationManager = () => {
    const [equations, setEquations] = useState([
        {
            id: 1,
            text: '',
            type: null,
            parameters: [],
            visible: true,
            color: COLORS[0],
            error: null,
            features: { showDerivative: false, showIntegral: false, integralRange: { min: 0, max: 2 }, showRoots: false }
        }
    ])
    const [activeId, setActiveId] = useState(1)

    const activeEquation = equations.find(eq => eq.id === activeId)

    const addEquation = useCallback(() => {
        setEquations(prev => {
            const nextId = Math.max(...prev.map(e => e.id), 0) + 1
            const color = COLORS[(prev.length) % COLORS.length]
            return [...prev, {
                id: nextId,
                text: '',
                type: null,
                parameters: [],
                visible: true,
                color,
                error: null,
                features: { showDerivative: false, showIntegral: false, integralRange: { min: 0, max: 2 }, showRoots: false }
            }]
        })
    }, [])

    const removeEquation = useCallback((id) => {
        setEquations(prev => {
            if (prev.length <= 1) return prev // Don't remove last one
            const filtered = prev.filter(e => e.id !== id)
            // If we removed the active one, select the previous one
            if (id === activeId) {
                setActiveId(filtered[filtered.length - 1].id)
            }
            return filtered
        })
    }, [activeId])

    const updateEquation = useCallback((id, equationString) => {
        setEquations(prev => prev.map(eq => {
            if (eq.id !== id) return eq

            if (!equationString) {
                return { ...eq, text: '', type: null, parameters: [], error: null }
            }

            try {
                const parsed = parseEquation(equationString)
                if (parsed.success) {
                    const type = classifyEquation(equationString, parsed.data.node)
                    const params = extractParameters(equationString, type)

                    // Removed automatic history addition to preventing spamming history while typing
                    // History should be added explicitly by the UI event handler (e.g. on Enter or Button click)

                    return {
                        ...eq,
                        text: equationString,
                        type,
                        parameters: params,
                        error: null
                    }
                } else {
                    return { ...eq, text: equationString, error: parsed.error }
                }
            } catch (err) {
                return { ...eq, text: equationString, error: 'Processing error' }
            }
        }))
    }, [activeId])

    const updateParameters = useCallback((id, newParams) => {
        setEquations(prev => prev.map(eq => {
            if (eq.id !== id) return eq
            return { ...eq, parameters: newParams }
        }))
    }, [])

    const updateFeatures = useCallback((id, featureUpdates) => {
        setEquations(prev => prev.map(eq => {
            if (eq.id !== id) return eq
            return { ...eq, features: { ...eq.features, ...featureUpdates } }
        }))
    }, [])

    const toggleVisibility = useCallback((id) => {
        setEquations(prev => prev.map(eq => {
            if (eq.id !== id) return eq
            return { ...eq, visible: !eq.visible }
        }))
    }, [])



    const saveEquation = useCallback((equationString) => {
        if (!equationString) return
        try {
            const parsed = parseEquation(equationString)
            if (parsed.success) {
                const type = classifyEquation(equationString, parsed.data.node)
                const params = extractParameters(equationString, type)
                addToHistory({ equation: equationString, type, parameters: params })
            }
        } catch (e) { console.error(e) }
    }, [])

    return {
        equations,
        activeId,
        activeEquation,
        setActiveId,
        addEquation,
        removeEquation,
        updateEquation,
        updateParameters,
        updateFeatures,

        toggleVisibility,
        saveEquation
    }
}
