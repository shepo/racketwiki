import {defineField, defineType} from 'sanity'
import {commonFields, groups, SECTIONS} from '../common'

export const page = defineType({
  name: 'page',
  title: 'Page (guide or editorial)',
  type: 'document',
  description: 'A guide at /guides/<slug>/, or an editorial or about page at /<slug>/ (e.g. /editorial-standards/).',
  groups,
  fields: [
    defineField({name: 'title', type: 'string', description: 'The page heading and browser title.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'kind', type: 'string', options: {list: ['guide', 'editorial', 'about']}, initialValue: 'guide', description: 'Guide: lives at /guides/<slug>/. Editorial or about: lives at /<slug>/.', group: 'content'}),
    defineField({name: 'kicker', type: 'string', description: 'Small coloured label above the heading.', group: 'content'}),
    defineField({name: 'lead', type: 'text', rows: 3, description: 'Answer-first standfirst, shown under the heading and used as the Google description.', group: 'content'}),
    defineField({name: 'body', type: 'richText', description: 'The article.', group: 'content'}),
    defineField({name: 'sources', type: 'array', of: [{type: 'reference', to: [{type: 'source'}]}], description: 'Listed as Sources at the foot of the page.', group: 'links'}),
    defineField({name: 'sports', type: 'array', of: [{type: 'reference', to: [{type: 'sport'}]}], description: 'Sports it covers. For editors; not shown yet.', group: 'links'}),
    defineField({name: 'author', type: 'string', initialValue: 'RacketWiki Editors', description: 'The byline on guides, and the author Google sees.', group: 'content'}),
    defineField({name: 'publishedAt', type: 'datetime', description: 'Sent to Google as the published date on guides.', group: 'meta'}),
    // `section` is chosen per page (guides can belong to any section).
    ...commonFields('sports', 'title').map((f) =>
      f.name === 'section' ? {...f, readOnly: false, options: {list: SECTIONS.map(({title, value}) => ({title, value}))}} : f,
    ),
  ],
})
