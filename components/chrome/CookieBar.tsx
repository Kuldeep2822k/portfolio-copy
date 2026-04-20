'use client'
import { useApp } from '@/lib/store'
import { useEffect, useState } from 'react'

export function CookieBar() {
    const [visible, setVisible] = useState(false)
    const ack = useApp((s) => s.acknowledgeCookie)

    useEffect(() => {
        const seen = localStorage.getItem('cookie-ack')
        if (!seen) setVisible(true)
        else ack()
    }, [ack])

    if (!visible) return null
    const decide = (accept: boolean) => {
        localStorage.setItem('cookie-ack', accept ? 'accept' : 'reject')
        ack()
        setVisible(false)
    }
    return (
        <div role="dialog" aria-label="Cookie preferences" className="fixed bottom-20 left-0 right-0 z-40 px-6">
            <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 bg-bg-elev/80 border border-fg/10 backdrop-blur-md font-mono text-xs text-fg-dim">
                <span>Essential cookies only. Analytics fire only after you accept.</span>
                <div className="flex gap-2 shrink-0">
                    <button data-cursor="hover" onClick={() => decide(true)} className="px-3 h-7 border border-fg/20 hover:text-signal hover:border-signal">
                        Accept
                    </button>
                    <button data-cursor="hover" onClick={() => decide(false)} className="px-3 h-7 border border-fg/20 hover:text-signal hover:border-signal">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    )
}