'use server'

import { supabase } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function recordWin(player: 'Usama' | 'Nicholas', delta: 1 | -1) {
    const { data, error } = await supabase
        .from('wins')
        .insert({ player, delta })
        .select()
        .single()

    if (error) {
        console.error('Error recording win:', error)
        throw new Error('Failed to record win')
    }

    revalidatePath('/')
    return data
}

export async function getWinTotals() {
    const { data, error } = await supabase
        .from('wins')
        .select('player, delta')

    if (error) {
        console.error('Error fetching win totals:', error)
        return { Usama: 0, Nicholas: 0 }
    }

    const totals = data.reduce(
        (acc, win) => {
            acc[win.player as 'Usama' | 'Nicholas'] += win.delta
            return acc
        },
        { Usama: 0, Nicholas: 0 } as Record<'Usama' | 'Nicholas', number>
    )

    return totals
}

export async function getWinHistory(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('wins')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching win history:', error)
        return []
    }

    return data
}

export async function getWinStats() {
    const history = await getWinHistory(30)

    // Calculate daily wins
    const dailyWins = history.reduce((acc, win) => {
        const date = new Date(win.created_at).toLocaleDateString()
        if (!acc[date]) {
            acc[date] = { Usama: 0, Nicholas: 0 }
        }
        acc[date][win.player] += win.delta
        return acc
    }, {} as Record<string, Record<'Usama' | 'Nicholas', number>>)

    // Calculate current streak
    const totals = await getWinTotals()

    return {
        dailyWins,
        totals,
        recentGames: history.slice(0, 10)
    }
}

export async function getWinTrends(days: number = 30) {
    const { data, error } = await supabase
        .from('wins')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching win trends:', error)
        return []
    }

    // Calculate cumulative wins over time
    let usamaTotal = 0
    let nicholasTotal = 0

    const trends = data.map(win => {
        if (win.player === 'Usama') {
            usamaTotal += win.delta
        } else {
            nicholasTotal += win.delta
        }

        return {
            timestamp: win.created_at,
            Usama: usamaTotal,
            Nicholas: nicholasTotal
        }
    })

    return trends
}

export async function getTrendTitle() {
    const stats = await getWinStats()
    const { totals, recentGames } = stats

    // Get actual wins (only count delta = 1, ignore undos)
    const actualGames = recentGames.filter(g => g.delta > 0)

    // Need at least 5 games to determine trend
    if (actualGames.length < 5) {
        return '🏆 Widen the Gap 🏆'
    }

    // Calculate last 5 games win rate
    const last5 = actualGames.slice(0, 5)
    const last5Usama = last5.filter(g => g.player === 'Usama').length
    const last5Nicholas = last5.filter(g => g.player === 'Nicholas').length

    // Calculate overall win rate
    const totalGames = totals.Usama + totals.Nicholas
    if (totalGames === 0) {
        return '🏆 Widen the Gap 🏆'
    }

    const usamaOverallRate = totals.Usama / totalGames
    const last5UsamaRate = last5Usama / 5

    // Determine who's currently leading
    const usamaLeading = totals.Usama > totals.Nicholas
    const leadingPlayer = usamaLeading ? 'Usama' : 'Nicholas'

    // Check if it's a very close battle (within 3 wins)
    const gap = Math.abs(totals.Usama - totals.Nicholas)
    if (gap <= 3) {
        return '⚔️ Head to Head Battle ⚔️'
    }

    // Calculate if recent trend is widening or tightening
    const recentTrendFavorsUsama = last5UsamaRate >= 0.6 // 3+ of last 5

    // Gap is widening if leader is winning most recent games
    if ((usamaLeading && recentTrendFavorsUsama) || (!usamaLeading && !recentTrendFavorsUsama)) {
        return `📈 The Gap is Getting Bigger 📈`
    }

    // Gap is tightening if trailing player is winning recent games
    if ((usamaLeading && !recentTrendFavorsUsama) || (!usamaLeading && recentTrendFavorsUsama)) {
        return `📉 The Gap is Tightening 📉`
    }

    // Default fallback
    return '🏆 Widen the Gap 🏆'
}
