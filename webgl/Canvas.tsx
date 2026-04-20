'use client'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { SceneDirector } from './SceneDirector'

export function PersistentCanvas() {
    const glProps = { antialias: true, alpha: false, powerPreference: 'high-performance' as const }
    const cameraProps = { position: [0, 0, 5] as [number, number, number], fov: 45 }
    return (
        <div className="fixed inset-0 z-0">
            <Canvas dpr={[1, 2]} gl={glProps} camera={cameraProps}>
                <color attach="background" args={[0x0a0a0a]} />
                <fog attach="fog" args={[0x0a0a0a, 8, 22]} />
                <SceneDirector />
                <EffectComposer>
                    <Bloom intensity={0.55} luminanceThreshold={0.75} luminanceSmoothing={0.2} mipmapBlur />
                    <Noise opacity={0.05} premultiply={false} />
                    <Vignette offset={0.3} darkness={0.55} />
                </EffectComposer>
            </Canvas>
        </div>
    )
}