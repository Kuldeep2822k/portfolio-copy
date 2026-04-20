'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useApp } from '@/lib/store'

interface Props { lines?: number; char?: string }

/**
 * Scroll-reactive marquee. Uses a single rAF loop that reads velocity from the
 * store imperatively (via useApp.getState()) and writes transform directly to
 * each row. This avoids the CSS `animation-duration` restart that happened
 * when velocity triggered React re-renders ~60×/sec.
 */
export function Divider({ lines = 3, char = '/' }: Props) {
    const rows = useRef<Array<HTMLDivElement | null>>([])
    const row = useMemo(() => char.repeat(200), [char])

    useEffect(() => {
        let rafId = 0
        let last = performance.now()
        const offsets = Array.from({ length: lines }, (_, i) => -i * 80)
        const basePxPerSec = 40

        const tick = (now: number) => {
            const dt = Math.min(64, now - last) / 1000
            last = now
            const v = Math.abs(useApp.getState().velocity)
            const speed = basePxPerSec * (1 + v * 0.002)
            for (let i = 0; i < lines; i++) {
                offsets[i] -= speed * dt
                const el = rows.current[i]
                if (el) {
                    // Doubled row content, so wrap at half-width for seamless loop.
                    const halfWidth = el.scrollWidth / 2
                    if (halfWidth > 0 && offsets[i] <= -halfWidth) offsets[i] += halfWidth
                    el.style.transform = `translate3d(${offsets[i]}px, 0, 0)`
                }
            }
            rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
    }, [lines])

    return (
        <div aria-hidden className="overflow-hidden pointer-events-none select-none text-fg-dim font-mono text-xs leading-tight">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => { rows.current[i] = el }}
                    className="whitespace-nowrap will-change-transform"
                >
                    {row + row}
                </div>
            ))}
        </div>
    )
}