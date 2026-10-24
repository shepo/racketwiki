import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const source = defineType({
  name: 'source',
  title: 'Source',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'publisher', type: 'string', description: 'Organisation that publishes it.', group: 'content'}),
    defineField({
      name: 'tier',
      type: 'number',
      options: {
        list: [
          {title: '1 Governing bodies and official rulebooks', value: 1},
          {title: '2 National bodies, tours and tournament organisers', value: 2},
          {title: '3 Manufacturers and recognised test labs', value: 3},
          {title: '4 Stats and records bodies', value: 4},
          {title: '5 Reputable press and community', value: 5},
        ],
      },
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'kind', type: 'string', options: {list: ['rulebook', 'regulations', 'website', 'ranking', 'specification', 'article', 'book', 'database']}, group: 'content'}),
    defineField({name: 'edition', type: 'string', description: 'e.g. "2024 edition", "v1.3".', group: 'content'}),
    defineField({name: 'url', type: 'url', group: 'content'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {list: [{title: 'Researched', value: 'researched'}, {title: 'Verify domain', value: 'verify'}]},
      initialValue: 'verify',
      description: 'The domain and URL are only shown publicly once Researched.',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'accessedOn', title: 'Last accessed', type: 'date', group: 'content'}),
    defineField({name: 'usedFor', type: 'string', description: 'Shown on the Sources page, e.g. "Rules and court dimensions".', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [{type: 'reference', to: [{type: 'sport'}]}], group: 'links'}),
    defineField({name: 'notes', type: 'text', rows: 3, group: 'content'}),
    ...commonFields('sources'),
  ],
  preview: {
    select: {title: 'name', tier: 'tier', status: 'status'},
    prepare: ({title, tier, status}) => ({title, subtitle: `Tier ${tier} · ${status === 'researched' ? 'Researched' : 'Verify domain'}`}),
  },
})
