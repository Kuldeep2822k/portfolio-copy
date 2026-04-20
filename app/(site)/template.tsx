'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * In Next App Router, a layout.tsx persists across routes, so AnimatePresence
 * inside a layout can't see exit animations. template.tsx re-mounts on every
 * route change, giving each route a clean enter animation.
 */
const enterInitial = { opacity: 0, y: 12 }
const enterAnimate = { opacity: 1, y: 0 }
const enterTransition = { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }

export default function Template({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={enterInitial}
            animate={enterAnimate}
            transition={enterTransition}
        >
            {children}
        </motion.div>
    )
}