import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
    site: 'https://hub.by.nikdelv.in',
    integrations: [tailwind(), preact()],
    devToolbar: {
        enabled: false
    }
})
