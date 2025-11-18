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
