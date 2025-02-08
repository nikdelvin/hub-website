import type { Config } from 'tailwindcss'
import { tailyUI, safeList } from 'taily-ui'

const config: Config = {
    content: [
        './src/pages/portfolio/*.astro',
        './src/pages/taily-ui/*.astro',
        './src/layouts/portfolio/*.astro',
        './src/layouts/projects/*.astro',
        './src/components/taily-ui/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
    ],
    theme: {
        extend: {}
    },
    plugins: [tailyUI],
    safelist: safeList
}
export default config
