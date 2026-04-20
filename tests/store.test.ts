import { describe, it, expect, beforeEach } from 'vitest'
import { useApp } from '@/lib/store'

describe('app store', () => {
    beforeEach(() => {
        useApp.setState({
            audioOn: false,
            activeScene: 0,
            scrollProgress: 0,
            velocity: 0,
            cursorMode: 'default',
            cookieAcknowledged: false,
        })
    })

    it('toggles audio', () => {
        expect(useApp.getState().audioOn).toBe(false)
        useApp.getState().toggleAudio()
        expect(useApp.getState().audioOn).toBe(true)
        useApp.getState().toggleAudio()
        expect(useApp.getState().audioOn).toBe(false)
    })

    it('only updates cursor when changed', () => {
        const before = useApp.getState()
        useApp.getState().setCursor('default')
        const after = useApp.getState()
        expect(after).toBe(before)
    })

    it('updates scroll progress and velocity together', () => {
        useApp.getState().setScroll(0.42, 3.1)
        const s = useApp.getState()
        expect(s.scrollProgress).toBeCloseTo(0.42)
        expect(s.velocity).toBeCloseTo(3.1)
    })
})