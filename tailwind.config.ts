import type { Config } from 'tailwindcss'
import { tailyUI, safeList } from 'taily-ui'

const config: Config = {
    content: [
        './src/pages/portfolio/*.astro',
        './src/pages/taily-ui/*.astro',
        './src/pages/taily-ui/**/*.astro',
        './src/pages/brodly/*.astro',
        './src/pages/feelicy/*.astro',
        './src/pages/neuroly/*.astro',
        './src/pages/scientry/*.astro',
        './src/pages/scripty/*.astro',
        './src/pages/cybergelion/*.astro',
        './src/pages/peppermeet/*.astro',
        './src/layouts/ProjectLayout.astro',
        './src/components/taily-ui/*.astro',
        './src/components/taily-ui/**/*.astro',
        './src/components/shared/*.astro',
        './src/components/cybergelion/Main.tsx',
        './src/components/peppermeet/Main.tsx'
    ],
    theme: {
        extend: {}
    },
    plugins: [tailyUI],
    safelist: safeList
}
export default config
