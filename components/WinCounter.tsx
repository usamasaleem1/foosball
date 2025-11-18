'use client'

import { useState, useEffect } from 'react'
import { recordWin } from '@/lib/actions/win-actions'
import { supabase } from '@/lib/supabase/client'

type WinCounterProps = {
    initialTotals: {
        Usama: number
        Nicholas: number
    }
}

export default function WinCounter({ initialTotals }: WinCounterProps) {
    const [totals, setTotals] = useState(initialTotals)
    const [loading, setLoading] = useState<string | null>(null)

    // Real-time subscription to win updates
    useEffect(() => {
        const channel = supabase
            .channel('wins-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'wins' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const win = payload.new as { player: 'Usama' | 'Nicholas'; delta: number }
                        setTotals((prev) => ({
                            ...prev,
                            [win.player]: prev[win.player] + win.delta,
                        }))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleWin = async (player: 'Usama' | 'Nicholas', delta: 1 | -1) => {
        setLoading(`${player}-${delta}`)

        // Optimistic update
        setTotals((prev) => ({
            ...prev,
            [player]: prev[player] + delta,
        }))

        try {
            await recordWin(player, delta)
        } catch (error) {
            // Revert on error
            setTotals((prev) => ({
                ...prev,
                [player]: prev[player] - delta,
            }))
            console.error('Failed to record win:', error)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div style={{
            marginBottom: '3rem',
        }} className="animate-slide-in">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
            }}>
                {/* Usama Counter */}
                <PlayerCard
                    name="Usama"
                    wins={totals.Usama}
                    color="var(--accent-usama)"
                    gradient="var(--gradient-usama)"
                    glow="var(--shadow-glow-usama)"
                    onIncrement={() => handleWin('Usama', 1)}
                    onDecrement={() => handleWin('Usama', -1)}
                    loading={loading?.startsWith('Usama') || false}
                />

                {/* Nicholas Counter */}
                <PlayerCard
                    name="Nicholas"
                    wins={totals.Nicholas}
                    color="var(--accent-nicholas)"
                    gradient="var(--gradient-nicholas)"
                    glow="var(--shadow-glow-nicholas)"
                    onIncrement={() => handleWin('Nicholas', 1)}
                    onDecrement={() => handleWin('Nicholas', -1)}
                    loading={loading?.startsWith('Nicholas') || false}
                />
            </div>

            {/* Winner Badge */}
            {totals.Usama !== totals.Nicholas && (
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-out',
                }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.75rem 2rem',
                        background: totals.Usama > totals.Nicholas ? 'var(--gradient-usama)' : 'var(--gradient-nicholas)',
                        borderRadius: 'var(--radius-xl)',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        boxShadow: totals.Usama > totals.Nicholas ? 'var(--shadow-glow-usama)' : 'var(--shadow-glow-nicholas)',
                    }}>
                        🏆 {totals.Usama > totals.Nicholas ? 'Usama' : 'Nicholas'} is leading by {Math.abs(totals.Usama - totals.Nicholas)}!
                    </div>
                </div>
            )}
        </div>
    )
}

type PlayerCardProps = {
    name: string
    wins: number
    color: string
    gradient: string
    glow: string
    onIncrement: () => void
    onDecrement: () => void
    loading: boolean
}

function PlayerCard({ name, wins, color, gradient, glow, onIncrement, onDecrement, loading }: PlayerCardProps) {
    return (
        <div className="glass" style={{
            padding: '2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
        }}>
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Player Name */}
            <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                {name}
            </h2>

            {/* Win Count */}
            <div style={{
                fontSize: 'clamp(4rem, 10vw, 6rem)',
                fontWeight: '900',
                lineHeight: '1',
                marginBottom: '2rem',
                color: color,
                textShadow: glow,
                transition: 'transform 0.3s ease',
                transform: loading ? 'scale(1.1)' : 'scale(1)',
            }}>
                {wins}
            </div>

            {/* Buttons */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
            }}>
                <button
                    onClick={onDecrement}
                    disabled={loading}
                    className="btn"
                    style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        width: '60px',
                        height: '60px',
                        fontSize: '2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    −
                </button>
                <button
                    onClick={onIncrement}
                    disabled={loading}
                    className="btn"
                    style={{
                        background: gradient,
                        color: 'white',
                        width: '80px',
                        height: '80px',
                        fontSize: '2.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: glow,
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    +
                </button>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                }} className="animate-pulse">
                    Updating...
                </div>
            )}
        </div>
    )
}
