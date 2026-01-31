import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook to manage graph calculations via Web Worker
 * @returns {Object} { generateData, loading, error, terminate }
 */
export const useGraphWorker = () => {
    const workerRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const pendingRequestsRef = useRef(new Map())

    useEffect(() => {
        // Initialize worker
        try {
            workerRef.current = new Worker(new URL('../workers/graphWorker.js', import.meta.url), {
                type: 'module'
            })

            workerRef.current.onmessage = (e) => {
                const { success, data, error: workerError, requestId } = e.data

                if (pendingRequestsRef.current.has(requestId)) {
                    const { resolve, reject } = pendingRequestsRef.current.get(requestId)

                    if (success) {
                        resolve(data)
                    } else {
                        reject(new Error(workerError))
                    }

                    pendingRequestsRef.current.delete(requestId)

                    // Update loading state
                    if (pendingRequestsRef.current.size === 0) {
                        setLoading(false)
                    }
                }
            }

            workerRef.current.onerror = (err) => {
                console.error('Worker error:', err)
                setError('Worker error: ' + err.message)
                setLoading(false)
                pendingRequestsRef.current.clear()
            }

        } catch (err) {
            console.error('Failed to initialize worker:', err)
            setError('Failed to initialize graph worker')
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate()
            }
        }
    }, [])

    const generateData = useCallback((type, payload) => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                reject(new Error('Worker not initialized'))
                return
            }

            setLoading(true)
            setError(null)

            const requestId = Math.random().toString(36).substring(7) + Date.now().toString()

            pendingRequestsRef.current.set(requestId, { resolve, reject })

            workerRef.current.postMessage({
                type,
                payload,
                requestId
            })
        })
    }, [])

    return { generateData, loading, error }
}
