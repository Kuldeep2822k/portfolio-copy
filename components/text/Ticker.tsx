'use client'
import { useApp } from '@/lib/store'

export function Ticker() {
    const audioOn = useApp((s) => s.audioOn)
    const scene = useApp((s) => s.activeScene)
    const label = [
        'TERMINAL ROOM',
        'DELHI NIGHT',
        'NEURAL LATTICE',
        'GPU MACRO',
        'VOID',
    ][scene] ?? 'IDLE'
    const text = audioOn
        ? `NOW PLAYING — ${label} — AMBIENT`
        : `SCENE — ${label} — AUDIO MUTED`
    const repeated = (text + '   •   ').repeat(8)
    return (
        <div className="overflow-hidden font-mono text-[10px] uppercase tracking-widest text-fg-dim">
            <div className="whitespace-nowrap marquee">{repeated}</div>
        </div>
    )
}