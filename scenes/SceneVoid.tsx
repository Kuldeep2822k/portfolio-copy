'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SceneVoid() {
    const pts = useRef<THREE.Points>(null)
    const horizon = useRef<THREE.Mesh>(null)

    const geom = useMemo(() => {
        const n = 800
        const arr = new Float32Array(n * 3)
        for (let i = 0; i < n; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 14
            arr[i * 3 + 1] = (Math.random() - 0.5) * 9
            arr[i * 3 + 2] = (Math.random() - 0.5) * 9
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
        return g
    }, [])

    useFrame((_, dt) => {
        if (pts.current) pts.current.rotation.y += dt * 0.02
        if (horizon.current) {
            const mat = horizon.current.material as THREE.MeshBasicMaterial
            mat.opacity = 0.4 + 0.1 * Math.sin(performance.now() * 0.0008)
        }
    })

    return (
        <group>
            <points ref={pts} geometry={geom}>
                <pointsMaterial size={0.025} color="#F2EFE6" transparent opacity={0.7} sizeAttenuation />
            </points>
            <mesh ref={horizon} position={[0, -1.5, -5]}>
                <planeGeometry args={[22, 0.003]} />
                <meshBasicMaterial color="#F2EFE6" transparent opacity={0.4} />
            </mesh>
        </group>
    )
}