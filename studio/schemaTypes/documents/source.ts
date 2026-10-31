import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const source = defineType({
  name: 'source',
  title: 'Source',
  type: 'document',
  description: 'An entry in the register on /sources/, under its tier. Facts that cite it link here and list it under Sources at the foot of the page.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'Shown wherever a fact cites this source.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'publisher', type: 'string', description: 'Organisation that publishes it. Shown after the name on /sources/ and in Sources lists.', group: 'content'}),
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
      description: 'Which tier section it is listed under on /sources/. Higher tiers win when sources disagree.',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'kind', type: 'string', options: {list: ['rulebook', 'regulations', 'website', 'ranking', 'specification', 'article', 'book', 'database']}, description: 'For editors; not shown.', group: 'content'}),
    defineField({name: 'edition', type: 'string', description: 'e.g. "2024 edition", "v1.3". Shown after the publisher.', group: 'content'}),
    defineField({name: 'url', type: 'url', description: 'The exact page or document. Its domain is shown and linked on /sources/ once Status is Researched.', group: 'content'}),
    defineField({name: 'noLink', title: 'Do not link', type: 'boolean', initialValue: false, description: 'On for a commercial provider’s own site (a rating app, a brand): its domain is shown as plain text in Sources lists and on /sources/, never as a link.', group: 'content'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {list: [{title: 'Researched', value: 'researched'}, {title: 'Verify domain', value: 'verify'}]},
      initialValue: 'verify',
      description: 'The domain and URL are only shown publicly once Researched.',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'accessedOn', title: 'Last accessed', type: 'date', description: 'Shown under Researched in the Status column on /sources/.', group: 'content'}),
    defineField({name: 'usedFor', type: 'string', description: 'The "What we use it for" column on /sources/, e.g. "Rules and court dimensions".', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [{type: 'reference', to: [{type: 'sport'}]}], description: 'Shown under the name on /sources/, linked to each sport.', group: 'links'}),
    defineField({name: 'notes', type: 'text', rows: 3, description: 'Studio only, never shown.', group: 'content'}),
    ...commonFields('sources'),
  ],
  preview: {
    select: {title: 'name', tier: 'tier', status: 'status'},
    prepare: ({title, tier, status}) => ({title, subtitle: `Tier ${tier} · ${status === 'researched' ? 'Researched' : 'Verify domain'}`}),
  },
})
