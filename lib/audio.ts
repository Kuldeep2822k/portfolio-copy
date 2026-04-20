'use client'
import { Howl, Howler } from 'howler'
import gsap from 'gsap'
import { useApp } from './store'

let ambient: Howl | null = null
let layers: Howl[] = []
let analyser: AnalyserNode | null = null
let initialized = false

function init() {
    if (initialized) return
    initialized = true

    ambient = new Howl({
        src: ['/audio/ambient.webm', '/audio/ambient.mp3'],
        loop: true,
        volume: 0,
        html5: false,
        onloaderror: () => console.warn('[audio] ambient missing — add /public/audio/ambient.webm'),
    })

    layers = [0, 1, 2, 3, 4].map(
        (i) =>
            new Howl({
                src: [`/audio/scene_${i}.webm`, `/audio/scene_${i}.mp3`],
                loop: true,
                volume: 0,
                html5: false,
                onloaderror: () => {
                    /* silent — layer files are optional */
                },
            })
    )

    // React to scene changes
    useApp.subscribe(
        (s) => s.activeScene,
        (scene) => setSceneLayer(scene)
    )
}

export function setMasterOn(on: boolean) {
    init()
    useApp.getState().setAudio(on)
    const target = on ? 0.35 : 0
    gsap.to(
        { v: Howler.volume() },
        {
            v: target,
            duration: 1.2,
            ease: 'sine.inOut',
            onUpdate() {
                Howler.volume((this.targets()[0] as { v: number }).v)
            },
            onStart() {
                if (on) {
                    ambient?.play()
                    layers.forEach((l) => l.play())
                }
            },
            onComplete() {
                if (!on) {
                    ambient?.pause()
                    layers.forEach((l) => l.pause())
                }
            },
        }
    )
    localStorage.setItem('audio-on', String(on))
}

export function setSceneLayer(active: number) {
    init()
    layers.forEach((l, i) => {
        const target = i === active ? 0.4 : 0
        gsap.to(
            { v: l.volume() },
            {
                v: target,
                duration: 0.9,
                ease: 'sine.inOut',
                onUpdate() {
                    l.volume((this.targets()[0] as { v: number }).v)
                },
            }
        )
    })
}

export function getAnalyser(): AnalyserNode | null {
    if (analyser) return analyser
    init()
    const ctx = Howler.ctx
    if (!ctx) return null
    analyser = ctx.createAnalyser()
    analyser.fftSize = 64
    // Howler.masterGain exists at runtime but isn't in @types/howler.
    const h = Howler as unknown as { masterGain: GainNode }
    h.masterGain.connect(analyser)
    return analyser
}

export function readFFT(): Uint8Array | null {
    const a = getAnalyser()
    if (!a) return null
    const data = new Uint8Array(a.frequencyBinCount)
    a.getByteFrequencyData(data)
    return data
}