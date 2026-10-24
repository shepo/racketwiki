import {defineField, defineType} from 'sanity'
import {commonFields, groups, SECTIONS} from '../common'

export const page = defineType({
  name: 'page',
  title: 'Page (guide or editorial)',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'kind', type: 'string', options: {list: ['guide', 'editorial', 'about']}, initialValue: 'guide', group: 'content'}),
    defineField({name: 'kicker', type: 'string', group: 'content'}),
    defineField({name: 'lead', type: 'text', rows: 3, description: 'Answer-first standfirst.', group: 'content'}),
    defineField({name: 'body', type: 'richText', group: 'content'}),
    defineField({name: 'sources', type: 'array', of: [{type: 'reference', to: [{type: 'source'}]}], group: 'links'}),
    defineField({name: 'sports', type: 'array', of: [{type: 'reference', to: [{type: 'sport'}]}], group: 'links'}),
    defineField({name: 'author', type: 'string', initialValue: 'RacketWiki Editors', group: 'content'}),
    defineField({name: 'publishedAt', type: 'datetime', group: 'meta'}),
    // `section` is chosen per page (guides can belong to any section).
    ...commonFields('sports', 'title').map((f) =>
      f.name === 'section' ? {...f, readOnly: false, options: {list: SECTIONS.map(({title, value}) => ({title, value}))}} : f,
    ),
  ],
})
