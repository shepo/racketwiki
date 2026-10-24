import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gojst4dq',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Hosted at https://racketwiki.sanity.studio (deployed by .github/workflows/studio.yml).
  studioHost: 'racketwiki',
  deployment: {appId: 'hizua30s7j18vj7a3f6tlgst'},
})
