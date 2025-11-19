import { getWinTotals, getWinStats, getWinTrends } from '@/lib/actions/win-actions'
import WinCounter from '@/components/WinCounter'
import StatsBoard from '@/components/StatsBoard'
import WinTrendGraph from '@/components/WinTrendGraph'
import PasswordGate from '@/components/PasswordGate'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const totals = await getWinTotals()
    const stats = await getWinStats()
    const trends = await getWinTrends()

    return (
        <PasswordGate>
            <main style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                padding: '2rem',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {/* Header */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '2rem',
                    }} className="animate-fade-in">
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em',
                        }}>
                            🏆 Widen the Gap 🏆
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--text-secondary)',
                        }}>
                            Usama vs Nicholas - Lifetime Stats
                        </p>
                    </header>

                    {/* Win Counter */}
                    <WinCounter initialTotals={totals} />

                    {/* Win Trend Graph */}
                    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                        <WinTrendGraph trends={trends} />
                    </div>

                    {/* Stats Dashboard */}
                    <StatsBoard stats={stats} />
                </div>
            </main>
        </PasswordGate>
    )
}
