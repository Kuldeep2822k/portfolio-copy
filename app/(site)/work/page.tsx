import Link from 'next/link'
import { FlickerText } from '@/components/text/FlickerText'
import { NavLink } from '@/components/ui/NavLink'
import { listProjects } from '@/lib/projects'

export const metadata = { title: 'Work' }

export default async function WorkPage() {
    const projects = await listProjects()
    return (
        <section className="min-h-screen px-6 md:px-12 pt-24 pb-32">
            <header className="flex items-baseline justify-between mb-12 border-b border-fg/10 pb-6">
                <FlickerText as="h1" className="font-display uppercase text-5xl md:text-7xl">
                    / Work
                </FlickerText>
                <span className="font-mono text-xs text-fg-dim uppercase tracking-widest">
                    {projects.length} projects
                </span>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p, i) => (
                    <Link
                        key={p.slug}
                        href={`/work/${p.slug}`}
                        data-cursor="hover"
                        className="group relative aspect-[4/3] bg-bg-elev/60 border border-fg/10 overflow-hidden transition-colors hover:border-signal/50"
                    >
                        {p.cover && (
                            <video
                                src={p.cover}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-80"
                            />
                        )}
                        <div className="absolute top-4 left-4 font-mono text-[10px] text-fg-dim uppercase tracking-widest">
                            {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between bg-gradient-to-t from-bg to-transparent">
                            <div>
                                <h3 className="font-display uppercase tracking-wide text-2xl md:text-3xl">{p.title}</h3>
                                <p className="font-mono text-xs text-fg-dim mt-1 max-w-sm">{p.summary}</p>
                            </div>
                            <span className="font-mono text-xs text-fg-dim">{p.year}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-16 flex justify-between font-mono text-xs text-fg-dim">
                <NavLink href="/">← Home</NavLink>
                <NavLink href="/contact">Contact →</NavLink>
            </div>
        </section>
    )
}