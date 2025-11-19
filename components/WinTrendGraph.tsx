'use client'

import { useEffect, useRef, useState } from 'react'

type TrendData = {
    timestamp: string
    Usama: number
    Nicholas: number
}

type WinTrendGraphProps = {
    trends: TrendData[]
}

export default function WinTrendGraph({ trends }: WinTrendGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: TrendData } | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || trends.length === 0) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height)

        // Padding
        const padding = { top: 30, right: 40, bottom: 50, left: 50 }
        const chartWidth = rect.width - padding.left - padding.right
        const chartHeight = rect.height - padding.top - padding.bottom

        // Find max wins for scaling
        const maxWins = Math.max(
            ...trends.map(t => Math.max(t.Usama, t.Nicholas))
        )
        const minWins = Math.min(
            0,
            ...trends.map(t => Math.min(t.Usama, t.Nicholas))
        )

        // Scale functions
        const xScale = (index: number) => padding.left + (index / (trends.length - 1)) * chartWidth
        const yScale = (value: number) => padding.top + chartHeight - ((value - minWins) / (maxWins - minWins)) * chartHeight

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1
        const gridLines = 5
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (i / gridLines) * chartHeight
            ctx.beginPath()
            ctx.moveTo(padding.left, y)
            ctx.lineTo(padding.left + chartWidth, y)
            ctx.stroke()
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(padding.left, padding.top)
        ctx.lineTo(padding.left, padding.top + chartHeight)
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
        ctx.stroke()

        // Draw Y-axis labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '12px Inter, sans-serif'
        ctx.textAlign = 'right'
        for (let i = 0; i <= gridLines; i++) {
            const value = maxWins - (i / gridLines) * (maxWins - minWins)
            const y = padding.top + (i / gridLines) * chartHeight
            ctx.fillText(Math.round(value).toString(), padding.left - 10, y + 4)
        }

        // Draw Usama's line
        ctx.strokeStyle = '#00d9ff'
        ctx.lineWidth = 3
        ctx.beginPath()
        trends.forEach((trend, index) => {
            const x = xScale(index)
            const y = yScale(trend.Usama)
            if (index === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.stroke()

        // Draw Usama's points
        ctx.fillStyle = '#00d9ff'
        trends.forEach((trend, index) => {
            const x = xScale(index)
            const y = yScale(trend.Usama)
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fill()
        })

        // Draw Nicholas's line
        ctx.strokeStyle = '#ff0080'
        ctx.lineWidth = 3
        ctx.beginPath()
        trends.forEach((trend, index) => {
            const x = xScale(index)
            const y = yScale(trend.Nicholas)
            if (index === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.stroke()

        // Draw Nicholas's points
        ctx.fillStyle = '#ff0080'
        trends.forEach((trend, index) => {
            const x = xScale(index)
            const y = yScale(trend.Nicholas)
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fill()
        })

        // Draw X-axis labels (dates)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '11px Inter, sans-serif'
        ctx.textAlign = 'center'
        const labelInterval = Math.max(1, Math.floor(trends.length / 6))
        trends.forEach((trend, index) => {
            if (index % labelInterval === 0 || index === trends.length - 1) {
                const x = xScale(index)
                const date = new Date(trend.timestamp)
                const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                ctx.fillText(label, x, padding.top + chartHeight + 20)
            }
        })

        // Draw legend
        const legendY = padding.top - 15
        ctx.font = '14px Inter, sans-serif'
        ctx.textAlign = 'left'

        ctx.fillStyle = '#00d9ff'
        ctx.fillRect(padding.left, legendY, 20, 3)
        ctx.fillText('Usama', padding.left + 25, legendY + 4)

        ctx.fillStyle = '#ff0080'
        ctx.fillRect(padding.left + 100, legendY, 20, 3)
        ctx.fillText('Nicholas', padding.left + 125, legendY + 4)

    }, [trends])

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas || trends.length === 0) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const padding = { top: 30, right: 40, bottom: 50, left: 50 }
        const chartWidth = rect.width - padding.left - padding.right

        // Find closest data point
        const index = Math.round(((x - padding.left) / chartWidth) * (trends.length - 1))
        if (index >= 0 && index < trends.length) {
            setHoveredPoint({ x, y, data: trends[index] })
        } else {
            setHoveredPoint(null)
        }
    }

    const handleMouseLeave = () => {
        setHoveredPoint(null)
    }

    if (trends.length === 0) {
        return (
            <div className="card animate-fade-in" style={{
                padding: '2rem',
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                }}>
                    Win Trends Over Time
                </h3>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    padding: '2rem',
                }}>
                    No data available yet. Start playing to see trends!
                </p>
            </div>
        )
    }

    return (
        <div className="card animate-fade-in" style={{
            padding: '2rem',
            position: 'relative',
        }}>
            <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
            }}>
                Win Trends Over Time
            </h3>

            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        width: '100%',
                        height: '400px',
                        cursor: 'crosshair',
                    }}
                />

                {hoveredPoint && (
                    <div style={{
                        position: 'absolute',
                        left: `${hoveredPoint.x}px`,
                        top: `${hoveredPoint.y - 80}px`,
                        background: 'rgba(20, 20, 31, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        pointerEvents: 'none',
                        transform: 'translateX(-50%)',
                        minWidth: '150px',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.5rem',
                        }}>
                            {new Date(hoveredPoint.data.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                        }}>
                            <div style={{
                                color: '#00d9ff',
                                fontWeight: '600',
                            }}>
                                Usama: {hoveredPoint.data.Usama}
                            </div>
                            <div style={{
                                color: '#ff0080',
                                fontWeight: '600',
                            }}>
                                Nicholas: {hoveredPoint.data.Nicholas}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
