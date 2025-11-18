import { getWinTotals, getWinStats } from '@/lib/actions/win-actions'
import WinCounter from '@/components/WinCounter'
import StatsBoard from '@/components/StatsBoard'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const totals = await getWinTotals()
    const stats = await getWinStats()

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0a0a0f 0%, #14141f 50%, #1e1e2e 100%)',
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
                }} className="animate-fade-in">
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem',
                    }}>
                        Foosball Championship
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

                {/* Stats Dashboard */}
                <StatsBoard stats={stats} />
            </div>
        </main>
    )
}
