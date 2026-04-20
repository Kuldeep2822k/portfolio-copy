import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
    content: [
        './app/**/*.{ts,tsx,mdx}',
        './components/**/*.{ts,tsx}',
        './scenes/**/*.{ts,tsx}',
        './webgl/**/*.{ts,tsx}',
        './content/**/*.{ts,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)',
                'bg-elev': 'var(--bg-elev)',
                fg: 'var(--fg)',
                'fg-dim': 'var(--fg-dim)',
                signal: 'var(--signal)',
                danger: 'var(--danger)',
            },
            fontFamily: {
                display: ['var(--font-display)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            },
        },
    },
    plugins: [typography],
} satisfies Config