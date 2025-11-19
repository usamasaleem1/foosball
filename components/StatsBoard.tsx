'use client'

type StatsBoardProps = {
    stats: {
        dailyWins: Record<string, Record<'Usama' | 'Nicholas', number>>
        totals: Record<'Usama' | 'Nicholas', number>
        recentGames: Array<{
            id: string
            player: 'Usama' | 'Nicholas'
            delta: number
            created_at: string
        }>
    }
}

export default function StatsBoard({ stats }: StatsBoardProps) {
    const { dailyWins, totals, recentGames } = stats

    // Calculate win percentage
    const totalGames = totals.Usama + totals.Nicholas
    const usamaPercentage = totalGames > 0 ? (totals.Usama / totalGames) * 100 : 50
    const nicholasPercentage = totalGames > 0 ? (totals.Nicholas / totalGames) * 100 : 50
    return (
        <div style={{
            display: 'grid',
            gap: '2rem',
        }}>
            {/* Win Percentage Bar */}
            <div className="card animate-fade-in" style={{
                padding: '2rem',
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                }}>
                    Overall Win Rate
                </h3>

                <div style={{
                    display: 'flex',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{
                        width: `${usamaPercentage}%`,
                        background: 'var(--accent-usama)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#000',
                        transition: 'width 0.5s ease',
                    }}>
                        {usamaPercentage.toFixed(1)}%
                    </div>
                    <div style={{
                        width: `${nicholasPercentage}%`,
                        background: 'var(--accent-nicholas)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#000',
                        transition: 'width 0.5s ease',
                    }}>
                        {nicholasPercentage.toFixed(1)}%
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                }}>
                    <span>Usama: {totals.Usama} wins</span>
                    <span>Total Games: {totalGames}</span>
                    <span>Nicholas: {totals.Nicholas} wins</span>
                </div>
            </div>

            {/* Recent Games */}
            <div className="card animate-fade-in" style={{
                padding: '2rem',
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                }}>
                    Recent Games
                </h3>

                {recentGames.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        padding: '2rem',
                    }}>
                        No games recorded yet. Start playing!
                    </p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gap: '0.75rem',
                    }}>
                        {recentGames.map((game, index) => (
                            <div
                                key={game.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: `4px solid ${game.player === 'Usama' ? 'var(--accent-usama)' : 'var(--accent-nicholas)'}`,
                                    animation: `slideInUp ${0.3 + index * 0.1}s ease-out`,
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: game.player === 'Usama' ? 'var(--accent-usama)' : 'var(--accent-nicholas)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                    }}>
                                        {game.delta > 0 ? '🏆' : '↩️'}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontWeight: '600',
                                            color: game.player === 'Usama' ? 'var(--accent-usama)' : 'var(--accent-nicholas)',
                                        }}>
                                            {game.player}
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                        }}>
                                            {game.delta > 0 ? 'Won a game' : 'Undo'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)',
                                }}>
                                    {new Date(game.created_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Daily Stats */}
            {Object.keys(dailyWins).length > 0 && (
                <div className="card animate-fade-in" style={{
                    padding: '2rem',
                }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                    }}>
                        Daily Breakdown (Last 30 Days)
                    </h3>

                    <div style={{
                        display: 'grid',
                        gap: '0.5rem',
                        maxHeight: '400px',
                        overflowY: 'auto',
                    }}>
                        {Object.entries(dailyWins)
                            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                            .map(([date, wins]) => (
                                <div
                                    key={date}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    <div style={{
                                        fontWeight: '500',
                                        color: 'var(--text-secondary)',
                                    }}>
                                        {date}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                    }}>
                                        <span style={{ color: 'var(--accent-usama)' }}>
                                            Usama: {wins.Usama}
                                        </span>
                                        <span style={{ color: 'var(--accent-nicholas)' }}>
                                            Nicholas: {wins.Nicholas}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}
