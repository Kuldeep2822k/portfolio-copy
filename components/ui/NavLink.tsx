'use client'
import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props extends LinkProps {
    children: ReactNode
    className?: string
}

export function NavLink({ children, className, ...rest }: Props) {
    return (
        <Link
            {...rest}
            data-cursor="hover"
            className={clsx(
                'inline-block font-mono text-xs uppercase tracking-widest text-fg-dim hover:text-signal transition-colors',
                className
            )}
        >
            {children}
        </Link>
    )
}