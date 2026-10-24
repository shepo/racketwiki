import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const story = defineType({
  name: 'story',
  title: 'Front page story',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'kicker', type: 'string', group: 'content'}),
    defineField({name: 'dek', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'isLead', type: 'boolean', initialValue: false, group: 'content'}),
    defineField({name: 'order', type: 'number', group: 'content'}),
    defineField({
      name: 'visual',
      type: 'string',
      options: {list: [{title: 'None', value: 'none'}, {title: 'Court overlay (from court documents)', value: 'court-overlay'}]},
      initialValue: 'none',
      group: 'content',
    }),
    defineField({name: 'courts', type: 'array', of: [{type: 'reference', to: [{type: 'court'}]}], hidden: ({document}) => document?.visual !== 'court-overlay', group: 'content'}),
    defineField({
      name: 'link',
      type: 'reference',
      to: [{type: 'page'}, {type: 'sport'}, {type: 'court'}, {type: 'ruleSet'}, {type: 'governingBody'}, {type: 'competition'}],
      group: 'links',
    }),
    defineField({name: 'path', type: 'string', description: 'Use instead of a reference for index pages, e.g. /courts/', group: 'links'}),
    ...commonFields('sports', 'title').map((f) => (f.name === 'section' ? {...f, readOnly: false} : f)),
  ],
  orderings: [{title: 'Front page order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
})
