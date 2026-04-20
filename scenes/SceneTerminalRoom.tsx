'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import '@/webgl/materials/GlitchMaterial'

export function SceneTerminalRoom() {
    const group = useRef<THREE.Group>(null)
    const mat = useRef<THREE.ShaderMaterial>(null)

    // Procedural "room": a big back wall + floor grid made of lines.
    const gridGeom = useMemo(() => {
        const g = new THREE.BufferGeometry()
        const positions: number[] = []
        const n = 20
        const size = 8
        for (let i = -n; i <= n; i++) {
            const t = (i / n) * size
            positions.push(-size, 0, t, size, 0, t)
            positions.push(t, 0, -size, t, 0, size)
        }
        g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        return g
    }, [])

    useFrame((_, dt) => {
        if (mat.current) mat.current.uniforms.uTime.value += dt
        if (group.current) group.current.rotation.y = Math.sin(performance.now() * 0.00015) * 0.05
    })

    return (
        <group ref={group} position={[0, -1.5, -4]}>
            {/* back wall: CRT-style glitch plane */}
            <mesh position={[0, 2.5, -2]}>
                <planeGeometry args={[8, 4.5]} />
                <glitch ref={mat} uColor={new THREE.Color('#FFB454')} uIntensity={0.08} transparent />
            </mesh>
            {/* floor grid */}
            <lineSegments geometry={gridGeom}>
                <lineBasicMaterial color="#3a2a18" transparent opacity={0.6} />
            </lineSegments>
            {/* desk silhouette */}
            <mesh position={[0, 0.4, 1.5]}>
                <boxGeometry args={[3, 0.1, 1.2]} />
                <meshStandardMaterial color="#1a1108" roughness={0.9} />
            </mesh>
            {/* monitor box */}
            <mesh position={[0, 1.4, 1.2]}>
                <boxGeometry args={[1.6, 1.1, 0.7]} />
                <meshStandardMaterial color="#221912" roughness={1} />
            </mesh>
        </group>
    )
}