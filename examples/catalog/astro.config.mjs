import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'static',
  site: 'https://kinekt-io.github.io',
  base: '/kinekt-sections',
  devToolbar: { enabled: false },
})
