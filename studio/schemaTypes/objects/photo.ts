import {defineField, defineType} from 'sanity'

/**
 * A stock photo with its credit. Free-licence sources only (Unsplash, Pexels, Pixabay);
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
    defineField({name: 'site', type: 'string', options: {list: [{title: 'Unsplash', value: 'unsplash'}, {title: 'Pexels', value: 'pexels'}, {title: 'Pixabay', value: 'pixabay'}, {title: 'Other', value: 'other'}]}}),
    defineField({name: 'sourceUrl', title: 'Photo page', type: 'url'}),
    defineField({name: 'licence', type: 'string', options: {list: ['Unsplash License', 'Pexels License', 'Pixabay Content License', 'Other']}}),
  ],
  preview: {select: {title: 'alt', subtitle: 'photographer', media: 'image'}},
})
