import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const story = defineType({
  name: 'story',
  title: 'Front page story',
  type: 'document',
  description: 'A story on the front page: the lead (big, top left) or one of up to four in the right-hand column. A story links to an existing page; it has no page of its own.',
  groups,
  fields: [
    defineField({name: 'title', type: 'string', description: 'The headline, linked to the story\u2019s Link or Path.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'kicker', type: 'string', description: 'Small label above the headline, coloured by Section.', group: 'content'}),
    defineField({name: 'dek', type: 'text', rows: 2, description: 'One or two sentences under the headline.', group: 'content'}),
    defineField({name: 'isLead', type: 'boolean', initialValue: false, description: 'Makes this the big lead story. Tick only one; if none is ticked, the first by Order leads.', group: 'content'}),
    defineField({name: 'order', type: 'number', description: 'Order in the right-hand column, lowest first. Only the first four show.', group: 'content'}),
    defineField({
      name: 'visual',
      type: 'string',
      options: {list: [{title: 'None', value: 'none'}, {title: 'Court overlay (from court documents)', value: 'court-overlay'}]},
      initialValue: 'none',
      description: 'Lead story only. Court overlay draws the chosen courts on top of each other, to scale.',
      group: 'content',
    }),
    defineField({name: 'courts', type: 'array', of: [{type: 'reference', to: [{type: 'court'}]}], description: 'Two to five courts to overlay. Each needs a sourced length and width.', hidden: ({document}) => document?.visual !== 'court-overlay', group: 'content'}),
    defineField({
      name: 'link',
      type: 'reference',
      to: [{type: 'page'}, {type: 'sport'}, {type: 'court'}, {type: 'ruleSet'}, {type: 'governingBody'}, {type: 'competition'}],
      description: 'The page the headline opens.',
      group: 'links',
    }),
    defineField({name: 'path', type: 'string', description: 'Use instead of Link for index pages, e.g. /courts/. Wins over Link if both are set.', group: 'links'}),
    ...commonFields('sports', 'title').map((f) => (f.name === 'section' ? {...f, readOnly: false} : f)),
  ],
  orderings: [{title: 'Front page order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
})
