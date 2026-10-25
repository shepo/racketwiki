import {defineField, defineType} from 'sanity'

/** An external address. Only shown on the site when status is "researched". */
export const webLink = defineType({
  name: 'webLink',
  type: 'object',
  fields: [
    defineField({name: 'url', type: 'url', description: 'The official website.'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {list: [{title: 'Researched', value: 'researched'}, {title: 'Verify domain', value: 'verify'}]},
      initialValue: 'verify',
      description: 'Researched shows the domain as a link (in key facts, directory listings and the front page). Verify domain shows "Domain being verified" instead. Only choose Researched once you have confirmed the site is the real one.',
    }),
  ],
})
