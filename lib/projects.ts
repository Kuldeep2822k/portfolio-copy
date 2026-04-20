import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'

export const projectSchema = z.object({
    slug: z.string(),
    title: z.string(),
    year: z.number(),
    role: z.string(),
    stack: z.array(z.string()).optional(),
    summary: z.string(),
    cover: z.string().optional(),
})

export type ProjectMeta = z.infer<typeof projectSchema>

const DIR = path.join(process.cwd(), 'content', 'projects')

export async function listProjects(): Promise<ProjectMeta[]> {
    const files = await fs.readdir(DIR)
    const items = await Promise.all(
        files.filter((f) => f.endsWith('.mdx')).map(async (f) => {
            const raw = await fs.readFile(path.join(DIR, f), 'utf8')
            const parsed = projectSchema.safeParse(matter(raw).data)
            if (!parsed.success) {
                throw new Error(`Invalid frontmatter in ${f}: ${parsed.error.message}`)
            }
            return parsed.data
        })
    )
    return items.sort((a, b) => b.year - a.year)
}

export async function loadProject(
    slug: string
): Promise<{ meta: ProjectMeta; content: string } | null> {
    const file = path.join(DIR, `${slug}.mdx`)
    try {
        const raw = await fs.readFile(file, 'utf8')
        const { data, content } = matter(raw)
        const parsed = projectSchema.safeParse(data)
        if (!parsed.success) {
            throw new Error(`Invalid frontmatter in ${slug}.mdx: ${parsed.error.message}`)
        }
        return { meta: parsed.data, content }
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
        throw e
    }
}

export async function listProjectSlugs(): Promise<string[]> {
    const files = await fs.readdir(DIR)
    return files
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => f.replace(/\.mdx$/, ''))
}