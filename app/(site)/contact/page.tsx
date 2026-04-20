'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { FlickerText } from '@/components/text/FlickerText'
import { Button } from '@/components/ui/Button'

const schema = z.object({
    name: z.string().min(1, 'Required'),
    email: z.string().email('Invalid email'),
    message: z.string().min(10, 'At least 10 characters'),
})
type FormData = z.infer<typeof schema>

export default function ContactPage() {
    const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(schema) })
    const { errors, isSubmitting } = formState
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: FormData) => {
        setError(null)
        try {
            const r = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!r.ok) throw new Error(await r.text())
            setSent(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error')
        }
    }

    return (
        <section className="min-h-screen px-6 md:px-12 pt-24 pb-32 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="self-end">
                <FlickerText as="h1" className="font-display uppercase text-6xl md:text-8xl leading-none">
                    Let&apos;s talk
                </FlickerText>
                <p className="mt-6 font-mono text-xs text-fg-dim uppercase tracking-widest max-w-xs">
                    Open to internships, freelance builds, hackathon teams, and coffee in Delhi.
                </p>
            </div>
            <div className="self-end max-w-md w-full">
                {sent ? (
                    <p className="font-mono text-sm uppercase tracking-widest text-signal">
                        → Message received. I reply within 48h.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-mono text-sm">
                        {(['name', 'email'] as const).map((f) => (
                            <div key={f}>
                                <label htmlFor={f} className="block text-xs uppercase tracking-widest text-fg-dim mb-1">
                                    {f}
                                </label>
                                <input
                                    id={f}
                                    {...register(f)}
                                    className="w-full bg-transparent border-b border-fg/20 py-2 focus:outline-none focus:border-signal transition-colors"
                                    autoComplete={f === 'email' ? 'email' : 'name'}
                                />
                                {errors[f] && (
                                    <span className="text-danger text-xs block mt-1">{errors[f]?.message}</span>
                                )}
                            </div>
                        ))}
                        <div>
                            <label htmlFor="message" className="block text-xs uppercase tracking-widest text-fg-dim mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                {...register('message')}
                                rows={5}
                                className="w-full bg-transparent border-b border-fg/20 py-2 focus:outline-none focus:border-signal transition-colors resize-none"
                            />
                            {errors.message && (
                                <span className="text-danger text-xs block mt-1">{errors.message.message}</span>
                            )}
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending…' : 'Send →'}
                        </Button>
                        {error && <p className="text-danger text-xs">{error}</p>}
                    </form>
                )}
            </div>
        </section>
    )
}