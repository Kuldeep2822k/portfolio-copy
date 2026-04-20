'use client'
import clsx from 'clsx'
import { ElementType, ReactNode } from 'react'

interface Props {
    as?: ElementType
    children: ReactNode
    className?: string
}

export function FlickerText({ as: Tag = 'span', children, className }: Props) {
    return <Tag className={clsx('flicker inline-block', className)}>{children}</Tag>
}