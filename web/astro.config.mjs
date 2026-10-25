import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://racketwiki.org',
  trailingSlash: 'always',
  output: 'static',
  build: {format: 'directory', inlineStylesheets: 'auto'},
  integrations: [sitemap({filter: (page) => !/\/(search|404)\//.test(page)})],
  vite: {server: {fs: {allow: ['..']}}},
})
