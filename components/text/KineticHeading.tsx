'use client'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import clsx from 'clsx'

interface Props {
    text: string
    className?: string
}

const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
}

const letter = {
    hidden: { y: '100%', opacity: 0, skewY: 6 },
    visible: {
        y: '0%',
        opacity: 1,
        skewY: 0,
        transition: { type: 'spring' as const, damping: 18, stiffness: 260 },
    },
}

export function KineticHeading({ text, className }: Props) {
    const chars = useMemo(() => Array.from(text), [text])
    return (
        <motion.h1
            key={text}
            initial="hidden"
            animate="visible"
            variants={container}
            aria-label={text}
            className={clsx('inline-flex flex-wrap overflow-hidden', className)}
        >
            {chars.map((c, i) => (
                <span key={i} aria-hidden className="inline-block overflow-hidden">
                    <motion.span variants={letter} className="inline-block">
                        {c === ' ' ? '\u00A0' : c}
                    </motion.span>
                </span>
            ))}
        </motion.h1>
    )
}