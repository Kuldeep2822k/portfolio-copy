import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/Providers'
import { Chrome } from '@/components/chrome/Chrome'
import { PersistentCanvas } from '@/webgl/Canvas'
import { site } from '@/content/site'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
    metadataBase: new URL('https://kuldeep.dev'),
    title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
    description: site.bio,
    openGraph: { title: site.name, description: site.bio, type: 'website' },
    twitter: { card: 'summary_large_image', creator: '@kuldeep2822k' },
    robots: { index: true, follow: true },
}

export const viewport: Viewport = {
    themeColor: '#0A0A0A',
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const htmlClass = `${display.variable} ${mono.variable} cursor-none`
    return (
        <html lang="en" className={htmlClass}>
            <body>
                <Providers>
                    <PersistentCanvas />
                    <main className="relative z-10">{children}</main>
                    <Chrome />
                </Providers>
            </body>
        </html>
    )
}