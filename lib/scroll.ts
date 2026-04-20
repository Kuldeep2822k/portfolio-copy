'use client'
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import { useApp, type SceneIndex } from './store'

export function useLenis() {
    useEffect(() => {
        if (typeof window === 'undefined') return
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduced) {
            const onScroll = () => {
                const max = document.documentElement.scrollHeight - window.innerHeight
                const p = max > 0 ? window.scrollY / max : 0
                useApp.getState().setScroll(p, 0)
            }
            onScroll()
            window.addEventListener('scroll', onScroll, { passive: true })
            return () => window.removeEventListener('scroll', onScroll)
        }

        const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1, smoothWheel: true })
        let last = 0
        let ema = 0
        const alpha = 0.15

        lenis.on('scroll', (e: { scroll: number; limit: number }) => {
            const progress = e.limit > 0 ? e.scroll / e.limit : 0
            const raw = e.scroll - last
            ema = ema * (1 - alpha) + raw * alpha
            last = e.scroll
            const sceneIdx = Math.min(4, Math.max(0, Math.round(progress * 4))) as SceneIndex
            const st = useApp.getState()
            st.setScroll(progress, ema)
            if (st.activeScene !== sceneIdx) st.setActiveScene(sceneIdx)
        })

        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(tick)
            lenis.destroy()
        }
    }, [])
}