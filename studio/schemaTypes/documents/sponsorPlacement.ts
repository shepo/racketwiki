import {defineField, defineType} from 'sanity'
import {SECTIONS} from '../common'

export const sponsorPlacement = defineType({
  name: 'sponsorPlacement',
  title: 'Sponsor placement',
  type: 'document',
  fields: [
    defineField({name: 'sponsor', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'scope',
      type: 'string',
      options: {list: ['site', 'section', 'sport', 'page']},
      validation: (r) => r.required(),
      description: 'Most specific wins: page › sport › section › site.',
    }),
    defineField({name: 'section', type: 'string', options: {list: SECTIONS.map(({title, value}) => ({title, value}))}, hidden: ({document}) => document?.scope !== 'section'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], hidden: ({document}) => document?.scope !== 'sport'}),
    defineField({name: 'pagePath', type: 'string', description: 'e.g. /sports/padel/courts/', hidden: ({document}) => document?.scope !== 'page'}),
    defineField({
      name: 'placement',
      type: 'string',
      options: {list: [{title: 'Strip at top of page', value: 'strip'}, {title: 'Sidebar card', value: 'card'}]},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'creative',
      type: 'object',
      fields: [
        defineField({name: 'headline', type: 'string'}),
        defineField({name: 'body', type: 'string'}),
        defineField({name: 'ctaLabel', type: 'string'}),
        defineField({name: 'ctaUrl', type: 'url'}),
        defineField({name: 'logo', type: 'image'}),
        defineField({name: 'theme', type: 'string', options: {list: ['rallio', 'neutral']}, initialValue: 'neutral'}),
      ],
    }),
    defineField({name: 'start', type: 'datetime'}),
    defineField({name: 'end', type: 'datetime'}),
  ],
  preview: {select: {title: 'sponsor', scope: 'scope', placement: 'placement'}, prepare: ({title, scope, placement}) => ({title, subtitle: `${placement} · ${scope}`})},
})
