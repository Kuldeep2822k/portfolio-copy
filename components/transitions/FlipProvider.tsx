'use client'
import { LayoutGroup, MotionConfig } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Wraps the app in a MotionConfig + LayoutGroup so `layoutId="..."` on
 * individual elements creates FLIP-style shared element transitions between
 * routes. Route-change enter animations are handled by
 * `app/(site)/template.tsx`, which re-mounts children on every navigation.
 */
export function FlipProvider({ children }: { children: ReactNode }) {
    const flipTransition = { type: 'spring' as const, stiffness: 200, damping: 26, mass: 0.9 }
    return (
        <MotionConfig transition={flipTransition}>
            <LayoutGroup>{children}</LayoutGroup>
        </MotionConfig>
    )
}