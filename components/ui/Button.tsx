'use client'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
    { variant = 'primary', className, children, ...rest },
    ref
) {
    const base = 'inline-flex items-center justify-center px-4 h-9 font-mono text-xs uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
        primary: 'border border-fg/30 hover:text-signal hover:border-signal',
        ghost: 'text-fg-dim hover:text-signal',
    }
    return (
        <button ref={ref} data-cursor="hover" className={clsx(base, variants[variant], className)} {...rest}>
            {children}
        </button>
    )
})