'use client'
import { useApp } from '@/lib/store'
import { SceneTerminalRoom } from '@/scenes/SceneTerminalRoom'
import { SceneDelhiNight } from '@/scenes/SceneDelhiNight'
import { SceneNeuralLattice } from '@/scenes/SceneNeuralLattice'
import { SceneGpuMacro } from '@/scenes/SceneGpuMacro'
import { SceneVoid } from '@/scenes/SceneVoid'
import { SceneCrossfade } from '@/components/transitions/SceneCrossfade'

function sceneWeight(progress: number, index: number, total: number) {
    const center = total > 1 ? index / (total - 1) : 0
    const dist = Math.abs(progress - center)
    // 1.0 at center, linearly falling, zero past ±(1/(total-1)).
    const width = total > 1 ? 1 / (total - 1) : 1
    return Math.max(0, 1 - dist / width)
}

export function SceneDirector() {
    const progress = useApp((s) => s.scrollProgress)
    const w = [0, 1, 2, 3, 4].map((i) => sceneWeight(progress, i, 5))

    return (
        <>
            <ambientLight intensity={0.25} />
            <directionalLight position={[3, 5, 2]} intensity={0.5} />
            <SceneCrossfade targetOpacity={w[0]}><SceneTerminalRoom /></SceneCrossfade>
            <SceneCrossfade targetOpacity={w[1]}><SceneDelhiNight /></SceneCrossfade>
            <SceneCrossfade targetOpacity={w[2]}><SceneNeuralLattice /></SceneCrossfade>
            <SceneCrossfade targetOpacity={w[3]}><SceneGpuMacro /></SceneCrossfade>
            <SceneCrossfade targetOpacity={w[4]}><SceneVoid /></SceneCrossfade>
        </>
    )
}