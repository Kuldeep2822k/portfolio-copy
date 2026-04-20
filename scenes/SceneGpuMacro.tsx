'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * An extreme close-up of a procedural GPU die: a dark metallic plane with a
 * fine grid of emissive squares whose brightness is modulated by a traveling
 * heat wave.
 */
export function SceneGpuMacro() {
    const matRef = useRef<THREE.ShaderMaterial>(null)

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 1 },
            uEmissive: { value: new THREE.Color('#FF6633') },
            uBase: { value: new THREE.Color('#101418') },
        }),
        []
    )

    useFrame((_, dt) => {
        if (matRef.current) matRef.current.uniforms.uTime.value += dt
    })

    const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
    const fragment = `
    precision highp float;
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uEmissive;
    uniform vec3 uBase;
    varying vec2 vUv;
    void main() {
      vec2 g = fract(vUv * 40.0) - 0.5;
      float d = max(abs(g.x), abs(g.y));
      float cell = smoothstep(0.48, 0.5, d);
      float heat = smoothstep(0.0, 1.0, sin((vUv.x + vUv.y) * 6.0 - uTime * 2.0) * 0.5 + 0.5);
      float mask = (1.0 - cell) * heat;
      vec3 col = mix(uBase, uEmissive, mask);
      float traces = smoothstep(0.02, 0.0, abs(fract(vUv.x * 12.0) - 0.5)) * 0.15;
      col += uEmissive * traces * heat;
      gl_FragColor = vec4(col, uOpacity);
    }
  `

    return (
        <mesh position={[0, 0, -3]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[8, 5]} />
            <shaderMaterial
                ref={matRef}
                transparent
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={uniforms}
            />
        </mesh>
    )
}