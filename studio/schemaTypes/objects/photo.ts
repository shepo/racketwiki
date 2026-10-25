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
    defineField({name: 'image', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'alt', title: 'Alt text', type: 'string', description: 'What the photo shows, for screen readers.', validation: (r) => r.required().max(140)}),
    defineField({name: 'photographer', type: 'string'}),
    defineField({name: 'photographerUrl', type: 'url'}),
    defineField({name: 'site', type: 'string', options: {list: [{title: 'Unsplash', value: 'unsplash'}, {title: 'Pexels', value: 'pexels'}, {title: 'Pixabay', value: 'pixabay'}, {title: 'Wikimedia Commons', value: 'wikimedia'}, {title: 'Other', value: 'other'}]}}),
    defineField({name: 'sourceUrl', title: 'Photo page', type: 'url'}),
    defineField({name: 'licence', type: 'string', description: 'e.g. Unsplash License, Pexels License, Pixabay Content License, CC BY-SA 4.0, CC BY 4.0, CC0. Creative Commons licences are shown in the credit, as they require.'}),
  ],
  preview: {select: {title: 'alt', subtitle: 'photographer', media: 'image'}},
})
