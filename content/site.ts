export const site = {
    name: 'Kuldeep',
    handle: 'kd',
    year: 2026,
    tagline: 'DevOps · Full-Stack · AI/ML',
    bio: 'B.Tech ECE at GGSIPU. I build systems that ship — then make them faster. Currently working on Aqua-AI and a retro terminal portfolio.',
    location: 'New Delhi, IN',
    email: 'kuldeep2822k@gmail.com',
    socials: [
        { label: 'GitHub', href: 'https://github.com/kuldeep2822k' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/kuldeep2822k' },
        { label: 'Twitter', href: 'https://twitter.com/kuldeep2822k' },
    ],
    nav: [
        { label: 'Work', href: '/work' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ],
} as const

export type Site = typeof site