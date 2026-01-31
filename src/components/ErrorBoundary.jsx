import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backgroundColor: '#0A0E27'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        padding: '2rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '2px solid #DC2626',
                        borderRadius: '1rem',
                        color: '#FEE2E2'
                    }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#FCA5A5' }}>
                            🐛 Something went wrong
                        </h1>
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Error Details (click to expand)
                            </summary>
                            <div style={{
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                marginTop: '0.5rem',
                                overflow: 'auto'
                            }}>
                                <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Stack:</strong></p>
                                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                            </div>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#DC2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
