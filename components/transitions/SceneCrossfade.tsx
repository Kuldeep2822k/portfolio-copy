'use client'
import { useFrame } from '@react-three/fiber'
import { useRef, ReactNode } from 'react'
import type { Group } from 'three'

interface Props {
    targetOpacity: number
    children: ReactNode
    lerp?: number
}

/**
 * Smoothly fades a group of 3D children in/out by interpolating a shared
 * opacity uniform via userData + overriding material.opacity on traversal.
 */
export function SceneCrossfade({ targetOpacity, children, lerp = 0.08 }: Props) {
    const ref = useRef<Group>(null)

    useFrame(() => {
        const g = ref.current
        if (!g) return
        const current = g.userData.opacity ?? 0
        const next = current + (targetOpacity - current) * lerp
        g.userData.opacity = next
        g.visible = next > 0.005
        g.traverse((o) => {
            type Mat = {
                opacity?: number
                transparent?: boolean
                uniforms?: Record<string, { value: number }>
            }
            const mesh = o as unknown as { material?: Mat | Array<Mat> }
            const mat = mesh.material
            if (!mat) return
            const apply = (m: Mat) => {
                m.transparent = true
                m.opacity = next
                // Shader materials (Glitch, lattice, GPU macro) use a uOpacity uniform.
                if (m.uniforms?.uOpacity) m.uniforms.uOpacity.value = next
            }
            if (Array.isArray(mat)) mat.forEach(apply)
            else apply(mat)
        })
    })

    return <group ref={ref}>{children}</group>
}