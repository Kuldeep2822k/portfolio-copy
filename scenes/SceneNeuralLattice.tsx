'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = `
  attribute vec3 offset;
  uniform float uTime;
  uniform float uPulseSpeed;
  varying float vPulse;
  varying float vDepth;
  void main() {
    vec3 p = position + offset;
    float d = length(offset) * 0.15;
    float pulse = 0.5 + 0.5 * sin(uTime * uPulseSpeed - d * 3.1);
    vPulse = pulse;
    vDepth = length(offset);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const frag = `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vPulse;
  varying float vDepth;
  void main() {
    vec3 col = mix(uColorA, uColorB, vPulse);
    float fade = smoothstep(12.0, 0.0, vDepth);
    gl_FragColor = vec4(col * (0.3 + vPulse * 1.4), uOpacity * (0.15 + vPulse * 0.85) * fade);
  }
`

export function SceneNeuralLattice() {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const matRef = useRef<THREE.ShaderMaterial>(null)

    const { geom, count } = useMemo(() => {
        const size = 8
        const step = 1
        const positions: number[] = []
        for (let x = -size; x <= size; x += step)
            for (let y = -size; y <= size; y += step)
                for (let z = -size; z <= size; z += step)
                    positions.push(x, y, z)
        const sphere = new THREE.IcosahedronGeometry(0.05, 0)
        const g = new THREE.InstancedBufferGeometry()
        g.index = sphere.index
        g.attributes = sphere.attributes
        g.setAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(positions), 3))
        return { geom: g, count: positions.length / 3 }
    }, [])

    useFrame((_, dt) => {
        if (matRef.current) matRef.current.uniforms.uTime.value += dt
        if (meshRef.current) meshRef.current.rotation.y += dt * 0.06
    })

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uPulseSpeed: { value: 1.6 },
            uOpacity: { value: 1 },
            uColorA: { value: new THREE.Color('#0E4F66') },
            uColorB: { value: new THREE.Color('#00E5FF') },
        }),
        []
    )

    return (
        <instancedMesh ref={meshRef} args={[geom, undefined, count]} position={[0, 0, -5]}>
            <shaderMaterial
                ref={matRef}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexShader={vert}
                fragmentShader={frag}
                uniforms={uniforms}
            />
        </instancedMesh>
    )
}