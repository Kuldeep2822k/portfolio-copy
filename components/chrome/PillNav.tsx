'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useApp } from '@/lib/store'
import { site } from '@/content/site'
import clsx from 'clsx'

export function PillNav() {
    const velocity = useApp((s) => s.velocity)
    const pathname = usePathname()
    const clamped = Math.max(-12, Math.min(12, velocity))
    const animateProps = { skewX: clamped * 0.4, y: clamped * 0.2 }
    const transitionProps = { type: 'spring' as const, stiffness: 180, damping: 20 }

    return (
        <motion.nav
            data-cursor="hover"
            animate={animateProps}
            transition={transitionProps}
            className="flex items-center gap-1 px-2 h-11 rounded-full border border-fg/15 bg-bg-elev/70 backdrop-blur-md font-mono text-xs uppercase tracking-widest"
        >
            <Link
                href="/"
                className={clsx(
                    'px-3 h-8 flex items-center rounded-full transition-colors',
                    pathname === '/' ? 'bg-fg text-bg' : 'hover:text-signal'
                )}
            >
                Home
            </Link>
            {site.nav.map((n) => {
                const active = pathname === n.href || pathname.startsWith(n.href + '/')
                return (
                    <Link
                        key={n.href}
                        href={n.href}
                        className={clsx(
                            'px-3 h-8 flex items-center rounded-full transition-colors',
                            active ? 'bg-fg text-bg' : 'hover:text-signal'
                        )}
                    >
                        {n.label}
                    </Link>
                )
            })}
        </motion.nav>
    )
}