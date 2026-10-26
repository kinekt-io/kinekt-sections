import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'

const netlifySite = process.env.DEPLOY_PRIME_URL ?? process.env.URL

export default defineConfig({
  output: 'static',
  site: netlifySite ?? 'https://kinekt-io.github.io',
  ...(netlifySite ? {} : { base: '/kinekt-sections' }),
  devToolbar: { enabled: false },
  vite: {
    resolve: {
      alias: {
        '@package-src': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
  },
})
