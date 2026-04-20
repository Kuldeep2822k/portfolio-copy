import { FlickerText } from '@/components/text/FlickerText'
import { site } from '@/content/site'
import Link from 'next/link'

export const metadata = { title: 'About' }

const facts: Array<[string, string]> = [
    ['Based in', site.location],
    ['Focus', 'DevOps · Full-stack · AI/ML'],
    ['Studying', 'B.Tech ECE, GGSIPU'],
    ['Shipped', 'Aqua-AI, MethaneWatch, SignSpeak'],
    ['Currently', 'C++ DSA 535, 30-week DevOps program'],
    ['Writes', 'Weekly reviews · Hackathon evals'],
]

export default function AboutPage() {
    return (
        <section className="min-h-screen px-6 md:px-12 pt-24 pb-32 max-w-4xl mx-auto">
            <FlickerText as="h1" className="font-display uppercase text-5xl md:text-7xl leading-none">
                / About
            </FlickerText>
            <p className="mt-10 font-mono text-base text-fg leading-relaxed max-w-2xl">
                {site.bio}
            </p>
            <dl className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm border-t border-fg/10 pt-6">
                {facts.map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-fg/5 pb-2">
                        <dt className="text-fg-dim uppercase tracking-widest text-[10px]">{k}</dt>
                        <dd className="text-fg text-right">{v}</dd>
                    </div>
                ))}
            </dl>
            <div className="mt-12">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-fg-dim mb-4">Elsewhere</h2>
                <ul className="space-y-2 font-mono text-sm">
                    {site.socials.map((s) => (
                        <li key={s.label}>
                            <Link href={s.href} target="_blank" rel="noreferrer" data-cursor="hover" className="hover:text-signal">
                                → {s.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}