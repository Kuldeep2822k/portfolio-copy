'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store'

export function CustomCursor() {
    const x = useMotionValue(-100)
    const y = useMotionValue(-100)
    const sx = useSpring(x, { damping: 25, mass: 0.3, stiffness: 300 })
    const sy = useSpring(y, { damping: 25, mass: 0.3, stiffness: 300 })
    const cursorMode = useApp((s) => s.cursorMode)
    const setCursor = useApp((s) => s.setCursor)
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (window.matchMedia('(hover: none)').matches) return
        setEnabled(true)

        const move = (e: PointerEvent) => {
            x.set(e.clientX)
            y.set(e.clientY)
            const target = e.target as HTMLElement | null
            const data = target?.closest('[data-cursor]')?.getAttribute('data-cursor')
            if (data === 'hover') setCursor('hover')
            else if (data === 'drag') setCursor('drag')
            else setCursor('default')
        }
        window.addEventListener('pointermove', move)
        return () => window.removeEventListener('pointermove', move)
    }, [x, y, setCursor])

    if (!enabled) return null

    const scale = cursorMode === 'hover' ? 2.4 : cursorMode === 'drag' ? 3 : 1
    const cursorStyle = { x: sx, y: sy, mixBlendMode: 'difference' as const }
    const innerAnimate = { scale }
    const innerTransition = { type: 'spring' as const, stiffness: 260, damping: 22 }

    return (
        <motion.div
            aria-hidden
            style={cursorStyle}
            className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2"
        >
            <motion.span
                animate={innerAnimate}
                transition={innerTransition}
                className="block w-3 h-3 rounded-full bg-fg"
            />
        </motion.div>
    )
}