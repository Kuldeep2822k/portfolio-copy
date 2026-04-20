'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SceneDelhiNight() {
    const stars = useRef<THREE.Points>(null)
    const windows = useRef<THREE.InstancedMesh>(null)
    const COUNT = 120
    const BUILDINGS = 40

    const starGeom = useMemo(() => {
        const arr = new Float32Array(COUNT * 3)
        for (let i = 0; i < COUNT; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 30
            arr[i * 3 + 1] = Math.random() * 6 + 2
            arr[i * 3 + 2] = -Math.random() * 10 - 4
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
        return g
    }, [])

    const buildings = useMemo(() => {
        const list: Array<{ x: number; y: number; w: number; h: number }> = []
        for (let i = 0; i < BUILDINGS; i++) {
            const x = (i - BUILDINGS / 2) * 0.6 + (Math.random() - 0.5) * 0.2
            const h = 0.8 + Math.random() * 2.8
            list.push({ x, y: h / 2 - 1.6, w: 0.45 + Math.random() * 0.15, h })
        }
        return list
    }, [])

    // Per-window state is stable across frames; compute once.
    const windowState = useMemo(() => {
        const arr: Array<{ x: number; y: number; s: number; h: number; lit: number; phase: number }> = []
        for (let i = 0; i < BUILDINGS * 6; i++) {
            const b = buildings[i % BUILDINGS]
            const row = Math.floor(i / BUILDINGS)
            arr.push({
                x: b.x + (Math.random() - 0.5) * 0.1,
                y: -1.6 + 0.3 + row * 0.4,
                s: 0.05 + Math.random() * 0.03,
                h: 0.1 + Math.random() * 0.05,
                lit: Math.random() > 0.15 ? 1 : 0,
                phase: Math.random() * Math.PI * 2,
            })
        }
        return arr
    }, [buildings])

    // Reusable scratch objects — allocated once, mutated per frame.
    const scratch = useMemo(
        () => ({ obj: new THREE.Object3D(), color: new THREE.Color() }),
        []
    )
    const matricesWritten = useRef(false)

    useFrame(({ clock }) => {
        if (stars.current) {
            const pm = stars.current.material as THREE.PointsMaterial
            pm.opacity = 0.6 + 0.4 * Math.sin(clock.elapsedTime * 2)
        }
        if (!windows.current) return

        // Write instance matrices once — windows never move.
        if (!matricesWritten.current) {
            for (let i = 0; i < windowState.length; i++) {
                const w = windowState[i]
                scratch.obj.position.set(w.x, w.y, -4.9)
                scratch.obj.scale.setScalar(w.s)
                scratch.obj.updateMatrix()
                windows.current.setMatrixAt(i, scratch.obj.matrix)
            }
            windows.current.instanceMatrix.needsUpdate = true
            matricesWritten.current = true
        }

        // Update only colors per frame — cheap vs. matrix writes.
        const t = clock.elapsedTime
        for (let i = 0; i < windowState.length; i++) {
            const w = windowState[i]
            const flicker = w.lit * (Math.sin(t * 2.3 + w.phase) > 0.92 ? 0.3 : 1)
            scratch.color.setHSL(w.h, 0.6, 0.5 * flicker)
            windows.current.setColorAt(i, scratch.color)
        }
        if (windows.current.instanceColor) windows.current.instanceColor.needsUpdate = true
    })

    return (
        <group position={[0, 0, 0]}>
            {/* sky haze */}
            <mesh position={[0, 3, -8]}>
                <planeGeometry args={[40, 12]} />
                <meshBasicMaterial color="#1a0f1a" transparent opacity={0.9} />
            </mesh>
            <points ref={stars} geometry={starGeom}>
                <pointsMaterial size={0.04} color="#F2D89A" transparent sizeAttenuation />
            </points>
            {/* buildings */}
            {buildings.map((b, i) => (
                <mesh key={i} position={[b.x, b.y, -5]}>
                    <boxGeometry args={[b.w, b.h, 0.4]} />
                    <meshBasicMaterial color="#0d0a1a" />
                </mesh>
            ))}
            {/* window lights */}
            <instancedMesh ref={windows} args={[undefined, undefined, BUILDINGS * 6]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial vertexColors transparent />
            </instancedMesh>
        </group>
    )
}