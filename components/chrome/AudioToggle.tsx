'use client'
import { useApp } from '@/lib/store'
import { setMasterOn, readFFT } from '@/lib/audio'
import { useEffect, useState } from 'react'

export function AudioToggle() {
    const audioOn = useApp((s) => s.audioOn)
    const toggle = useApp((s) => s.toggleAudio)
    const [bars, setBars] = useState<number[]>([4, 6, 8, 5])

    useEffect(() => {
        if (!audioOn) {
            setBars([2, 2, 2, 2])
            return
        }
        let cancelled = false
        let rafId: number | null = null
        let timeoutId: number | null = null
        const tick = () => {
            if (cancelled) return
            const fft = readFFT()
            if (fft && fft.length >= 16) {
                // Sample 4 bins across the low-mid range for visual variety.
                const sampled = [fft[2], fft[6], fft[10], fft[14]].map((v) => 2 + (v / 255) * 12)
                setBars(sampled)
            } else {
                setBars((prev) => prev.map(() => 3 + Math.random() * 11))
            }
            timeoutId = window.setTimeout(() => {
                timeoutId = null
                if (cancelled) return
                rafId = requestAnimationFrame(tick)
            }, 100)
        }
        tick()
        return () => {
            cancelled = true
            if (timeoutId !== null) clearTimeout(timeoutId)
            if (rafId !== null) cancelAnimationFrame(rafId)
        }
    }, [audioOn])

    const onClick = () => {
        const next = !audioOn
        toggle()
        setMasterOn(next)
    }

    return (
        <button
            data-cursor="hover"
            onClick={onClick}
            aria-pressed={audioOn}
            aria-label={audioOn ? 'Mute ambient audio' : 'Play ambient audio'}
            className="flex items-center gap-2 px-3 h-8 rounded-full border border-fg/15 bg-bg-elev/70 backdrop-blur-md font-mono text-xs uppercase tracking-widest hover:text-signal transition-colors"
        >
            <span>{audioOn ? 'Audio On' : 'Toggle Audio'}</span>
            <span className="flex items-end gap-[2px] h-3.5" aria-hidden>
                {bars.map((h, i) => {
                    const barStyle: React.CSSProperties = { height: `${h}px` }
                    return (
                        <span
                            key={i}
                            style={barStyle}
                            className="w-[2px] bg-signal transition-[height] duration-100"
                        />
                    )
                })}
            </span>
        </button>
    )
}