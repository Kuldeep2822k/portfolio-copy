import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200),
    message: z.string().min(10).max(5000),
})

// Simple in-memory rate limit (swap for Upstash Redis in production)
const hits = new Map<string, { count: number; reset: number }>()
const LIMIT = 5
const WINDOW_MS = 60_000

function rateLimit(ip: string) {
    const now = Date.now()
    const entry = hits.get(ip)
    if (!entry || entry.reset < now) {
        hits.set(ip, { count: 1, reset: now + WINDOW_MS })
        return true
    }
    entry.count += 1
    return entry.count <= LIMIT
}

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!rateLimit(ip)) {
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }
    try {
        const body = await req.json()
        const data = schema.parse(body)
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
            console.warn('[contact] RESEND_API_KEY missing — returning mock success')
            return NextResponse.json({ ok: true, mock: true })
        }
        const resend = new Resend(apiKey)
        await resend.emails.send({
            from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <noreply@kuldeep.dev>',
            to: [process.env.CONTACT_TO_EMAIL ?? 'kuldeep2822k@gmail.com'],
            replyTo: data.email,
            subject: `Portfolio contact from ${data.name}`,
            text: `${data.message}\n\n—\nFrom: ${data.name} <${data.email}>\nIP: ${ip}`,
        })
        return NextResponse.json({ ok: true })
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'invalid_request'
        return NextResponse.json({ ok: false, error: msg }, { status: 400 })
    }
}