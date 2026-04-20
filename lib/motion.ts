'use client'
import gsap from 'gsap'

let configured = false

export function configureMotion() {
    if (configured) return
    configured = true
    gsap.defaults({ ease: 'expo.out', duration: 0.7 })
    gsap.config({ nullTargetWarn: false })
}