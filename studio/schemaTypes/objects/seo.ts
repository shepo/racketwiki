import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'title', type: 'string', description: 'Replaces the page title in Google results and browser tabs. Empty uses the name.', validation: (r) => r.max(65).warning('Keep titles under 65 characters')}),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Replaces the summary Google shows under the title. Empty uses the summary.',
      validation: (r) => r.max(160).warning('Keep descriptions under 160 characters'),
    }),
    defineField({name: 'canonical', type: 'url', description: 'Not used by the site yet: every page uses its own address.'}),
    defineField({name: 'ogImage', title: 'Open Graph image', type: 'image', description: 'Not used by the site yet. Meant for the picture shown when the page is shared on social media.'}),
  ],
})
