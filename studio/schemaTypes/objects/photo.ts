import {defineField, defineType} from 'sanity'

/**
 * A photo with its credit. Free-licence sources only (Unsplash, Pexels, Pixabay, Wikimedia Commons);
 * the credit is shown on the site even where the licence does not require it.
 */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload the original. The site crops it to fit (wide on sport pages, 3:2 for equipment, 4:3 for players); use the hotspot to choose what stays in frame.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'alt', title: 'Alt text', type: 'string', description: 'What the photo shows, for screen readers and search engines. Not shown on the page. Describe only what is visible.', validation: (r) => r.required().max(140)}),
    defineField({name: 'photographer', type: 'string', description: 'Shown in the credit under the photo: "Photo: <name> on Pexels".'}),
    defineField({name: 'photographerUrl', type: 'url', description: 'Their profile page. Makes the name in the credit a link.'}),
    defineField({name: 'site', type: 'string', options: {list: [{title: 'Unsplash', value: 'unsplash'}, {title: 'Pexels', value: 'pexels'}, {title: 'Pixabay', value: 'pixabay'}, {title: 'Wikimedia Commons', value: 'wikimedia'}, {title: 'Other', value: 'other'}]}, description: 'The site named in the credit ("on Pexels", "via Wikimedia Commons").'}),
    defineField({name: 'sourceUrl', title: 'Photo page', type: 'url', description: 'The page the photo came from. Makes the site name in the credit a link. Keep it so the licence can be checked.'}),
    defineField({name: 'licence', type: 'string', description: 'e.g. Unsplash License, Pexels License, Pixabay Content License, CC BY-SA 4.0, CC BY 4.0, CC0. Creative Commons licences are shown in the credit, as they require.'}),
  ],
  preview: {select: {title: 'alt', subtitle: 'photographer', media: 'image'}},
})
