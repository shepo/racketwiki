import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {openOnSite} from './actions/openOnSite'

export default defineConfig({
  name: 'racketwiki',
  title: 'RacketWiki',
  // The project ID is not a secret. Set SANITY_STUDIO_PROJECT_ID once the project exists.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gojst4dq',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure}), visionTool()],
  schema: {types: schemaTypes},
  document: {
    // "Open on racketwiki.org" sits second in each document's action menu, after Publish.
    actions: (prev, ctx) => (['correction', 'sponsorPlacement'].includes(ctx.schemaType) ? prev : [prev[0], openOnSite, ...prev.slice(1)]),
  },
})
