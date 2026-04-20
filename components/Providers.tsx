'use client'
import { ReactNode, useEffect } from 'react'
import { useLenis } from '@/lib/scroll'
import { configureMotion } from '@/lib/motion'
import { FlipProvider } from '@/components/transitions/FlipProvider'

export function Providers({ children }: { children: ReactNode }) {
    useLenis()
    useEffect(() => {
        configureMotion()
        const saved = localStorage.getItem('audio-on')
        if (saved === 'true') {
            import('@/lib/audio').then((m) => m.setMasterOn(true))
        }
    }, [])
    return <FlipProvider>{children}</FlipProvider>
}