import {defineField, defineType} from 'sanity'

/** An external address. Only shown on the site when status is "researched". */
export const webLink = defineType({
  name: 'webLink',
  type: 'object',
  fields: [
    defineField({name: 'url', type: 'url'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {list: [{title: 'Researched', value: 'researched'}, {title: 'Verify domain', value: 'verify'}]},
      initialValue: 'verify',
    }),
  ],
})
