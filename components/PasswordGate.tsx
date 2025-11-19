'use client'

import { useState, useEffect } from 'react'

const MASTER_PASSWORD = 'cestlavie'
const STORAGE_KEY = 'foosball_auth'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if password is saved in localStorage
        const savedPassword = localStorage.getItem(STORAGE_KEY)
        if (savedPassword === MASTER_PASSWORD) {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (password === MASTER_PASSWORD) {
            localStorage.setItem(STORAGE_KEY, password)
            setIsAuthenticated(true)
            setError('')
        } else {
            setError('Incorrect password. Please try again.')
            setPassword('')
        }
    }

    // Show loading state briefly while checking localStorage
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-secondary)',
                }}>
                    Loading...
                </div>
            </div>
        )
    }

    // If authenticated, show the children (main app)
    if (isAuthenticated) {
        return <>{children}</>
    }

    // Show password gate
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '3rem',
                maxWidth: '450px',
                width: '100%',
            }} className="animate-fade-in">
                {/* Lock Icon */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                    }}>
                        🔒
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                    }}>
                        Protected Access
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                    }}>
                        Enter the master password to continue
                    </p>
                </div>

                {/* Password Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{
                        marginBottom: '1.5rem',
                    }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter password"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                fontSize: '1rem',
                                background: 'var(--bg-secondary)',
                                border: error ? '2px solid #ef4444' : '2px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                transition: 'all 0.15s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.border = '2px solid var(--accent-usama)'
                                e.target.style.background = 'var(--bg-tertiary)'
                            }}
                            onBlur={(e) => {
                                if (!error) {
                                    e.target.style.border = '2px solid var(--border-color)'
                                }
                                e.target.style.background = 'var(--bg-secondary)'
                            }}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#fca5a5',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            background: 'var(--accent-usama)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: '#000',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    )
}
