'use client'
import { PillNav } from './PillNav'
import { AudioToggle } from './AudioToggle'
import { CookieBar } from './CookieBar'
import { CustomCursor } from './CustomCursor'
import { Ticker } from '@/components/text/Ticker'
import { site } from '@/content/site'

export function Chrome() {
    return (
        <>
            <CustomCursor />
            <div className="fixed top-4 left-4 z-50"><AudioToggle /></div>
            <div className="fixed top-4 right-4 z-50 font-mono text-xs text-fg-dim uppercase tracking-widest">
                {site.handle.toUpperCase()} · {site.year}
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-40 pb-3 pointer-events-none">
                <div className="px-6 pb-2 pointer-events-auto"><Ticker /></div>
                <div className="flex justify-center pointer-events-auto"><PillNav /></div>
            </div>
            <CookieBar />
        </>
    )
}