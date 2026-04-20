import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { FlickerText } from '@/components/text/FlickerText'
import { loadProject, listProjectSlugs } from '@/lib/projects'

interface Params { params: { slug: string } }

export async function generateStaticParams() {
    const slugs = await listProjectSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params) {
    const project = await loadProject(params.slug)
    if (!project) return {}
    return { title: project.meta.title }
}

export default async function ProjectPage({ params }: Params) {
    const project = await loadProject(params.slug)
    if (!project) notFound()
    const { meta, content } = project
    const stack = meta.stack ?? []
    return (
        <article className="min-h-screen px-6 md:px-12 pt-24 pb-32 max-w-4xl mx-auto">
            <header className="mb-12 border-b border-fg/10 pb-6">
                <p className="font-mono text-xs text-fg-dim uppercase tracking-widest mb-4">
                    {meta.year} · {meta.role}
                </p>
                <FlickerText as="h1" className="font-display uppercase text-5xl md:text-7xl leading-none">
                    {meta.title}
                </FlickerText>
                {stack.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-fg-dim">
                        {stack.map((s) => (
                            <li key={s} className="px-2 py-1 border border-fg/15">{s}</li>
                        ))}
                    </ul>
                )}
            </header>
            <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed">
                <MDXRemote source={content} />
            </div>
            <footer className="mt-20 flex justify-between font-mono text-xs text-fg-dim">
                <Link href="/work" data-cursor="hover" className="hover:text-signal">← All work</Link>
                <Link href="/contact" data-cursor="hover" className="hover:text-signal">Work together →</Link>
            </footer>
        </article>
    )
}