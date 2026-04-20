'use client'
import { FlickerText } from '@/components/text/FlickerText'
import { KineticHeading } from '@/components/text/KineticHeading'
import { Divider } from '@/components/ui/Divider'
import { useApp } from '@/lib/store'
import { site } from '@/content/site'

const overlays = [
    { title: 'KULDEEP', sub: `Building on the web since 2023 — ${site.location}.` },
    { title: 'TERMINAL //', sub: 'Shell, systems, and DevOps. Vim-first.' },
    { title: 'NEURAL //', sub: 'Aqua-AI, CNNs, and water you can drink.' },
    { title: 'GPU //', sub: 'Shaders, instancing, 60fps on the cheap.' },
    { title: 'VOID //', sub: 'Scroll to contact. The cursor is a mirror.' },
]

export default function HomePage() {
    const activeScene = useApp((s) => s.activeScene)
    const current = overlays[activeScene] ?? overlays[0]
    const rootStyle: React.CSSProperties = { height: '500vh' }
    return (
        <div style={rootStyle} className="relative">
            <div className="fixed inset-0 pointer-events-none flex items-end p-6 md:p-12">
                <div className="max-w-4xl w-full">
                    <Divider lines={3} />
                    <KineticHeading
                        text={current.title}
                        className="font-display uppercase tracking-wide leading-none text-[clamp(3rem,12vw,10rem)] mt-6"
                    />
                    <FlickerText
                        as="p"
                        className="mt-4 font-mono text-sm text-fg-dim uppercase tracking-widest max-w-xl"
                    >
                        {current.sub}
                    </FlickerText>
                    <div className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-fg-dim">
                        <span>Scene {String(activeScene + 1).padStart(2, '0')} / 05</span>
                        <span className="w-6 h-px bg-fg-dim/40" />
                        <span>Scroll ↓</span>
                    </div>
                </div>
            </div>
        </div>
    )
}