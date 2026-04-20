import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type SceneIndex = 0 | 1 | 2 | 3 | 4
export type CursorMode = 'default' | 'hover' | 'drag'

interface AppState {
    audioOn: boolean
    activeScene: SceneIndex
    scrollProgress: number
    velocity: number
    cursorMode: CursorMode
    cookieAcknowledged: boolean
    setAudio: (on: boolean) => void
    toggleAudio: () => void
    setActiveScene: (i: SceneIndex) => void
    setScroll: (p: number, v: number) => void
    setCursor: (m: CursorMode) => void
    acknowledgeCookie: () => void
}

export const useApp = create<AppState>()(
    subscribeWithSelector((set) => ({
        audioOn: false,
        activeScene: 0,
        scrollProgress: 0,
        velocity: 0,
        cursorMode: 'default',
        cookieAcknowledged: false,
        setAudio: (audioOn) => set({ audioOn }),
        toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
        setActiveScene: (activeScene) => set({ activeScene }),
        setScroll: (scrollProgress, velocity) => set({ scrollProgress, velocity }),
        setCursor: (cursorMode) => set((s) => (s.cursorMode === cursorMode ? s : { cursorMode })),
        acknowledgeCookie: () => set({ cookieAcknowledged: true }),
    }))
)