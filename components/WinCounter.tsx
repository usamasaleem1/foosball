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
                    onIncrement={() => handleWin('Usama', 1)}
                    onDecrement={() => handleWin('Usama', -1)}
                    loading={loading?.startsWith('Usama') || false}
                />

                {/* Nicholas Counter */}
                <PlayerCard
                    name="Nicholas"
                    wins={totals.Nicholas}
                    color="var(--accent-nicholas)"
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
                        background: 'var(--bg-secondary)',
                        border: `2px solid ${totals.Usama > totals.Nicholas ? 'var(--accent-usama)' : 'var(--accent-nicholas)'}`,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: totals.Usama > totals.Nicholas ? 'var(--accent-usama)' : 'var(--accent-nicholas)',
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
    onIncrement: () => void
    onDecrement: () => void
    loading: boolean
}

function PlayerCard({ name, wins, color, onIncrement, onDecrement, loading }: PlayerCardProps) {
    return (
        <div className="card" style={{
            padding: '2rem',
            textAlign: 'center',
            position: 'relative',
            transition: 'all 0.15s ease',
        }}>
            {/* Player Name */}
            <h2 style={{
                fontSize: '2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: color,
            }}>
                {name}
            </h2>

            {/* Win Count */}
            <div style={{
                fontSize: 'clamp(4rem, 10vw, 6rem)',
                fontWeight: '700',
                lineHeight: '1',
                marginBottom: '2rem',
                color: color,
                transition: 'transform 0.15s ease',
                transform: loading ? 'scale(1.05)' : 'scale(1)',
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
                        color: 'var(--text-secondary)',
                        width: '80px',
                        height: '80px',
                        fontSize: '2.5rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    -
                </button>
                <button
                    onClick={onIncrement}
                    disabled={loading}
                    className="btn"
                    style={{
                        background: color,
                        color: '#000',
                        width: '80px',
                        height: '80px',
                        fontSize: '2.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: '700',
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
