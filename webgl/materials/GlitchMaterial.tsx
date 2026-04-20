'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const Glitch = shaderMaterial(
    { uTime: 0, uIntensity: 0.2, uColor: new THREE.Color('#F2EFE6'), uOpacity: 1 },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    float rand(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      float band = step(0.995, sin(vUv.y * 800.0 + uTime * 30.0) * 0.5 + 0.5);
      float n = rand(vec2(floor(vUv.y * 140.0), floor(uTime * 20.0)));
      float shift = (n - 0.5) * uIntensity * band;
      float scan = 0.5 + 0.5 * sin(vUv.y * 600.0);
      vec3 col = uColor * (0.85 + 0.15 * scan) + shift;
      gl_FragColor = vec4(col, uOpacity);
    }
  `
)

extend({ Glitch })

declare module '@react-three/fiber' {
    interface ThreeElements {
        glitch: { uTime?: number; uIntensity?: number; uColor?: THREE.Color; uOpacity?: number; transparent?: boolean; ref?: React.Ref<THREE.ShaderMaterial> }
    }
}

export { Glitch }