import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gojst4dq',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})
