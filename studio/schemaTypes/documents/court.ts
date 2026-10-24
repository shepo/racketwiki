import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const court = defineType({
  name: 'court',
  title: 'Court',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'e.g. "Padel court", "Tennis court (doubles)"', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], validation: (r) => r.required(), group: 'links'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first, e.g. "A padel court is 20 m long and 10 m wide…"', group: 'content'}),
    defineField({
      name: 'standard',
      type: 'boolean',
      initialValue: true,
      description: 'Untick for sports where every venue differs (real tennis, rackets).',
      group: 'content',
    }),
    defineField({name: 'nonStandardNote', type: 'text', rows: 3, hidden: ({document}) => document?.standard !== false, group: 'content'}),
    defineField({name: 'length', type: 'sourcedFact', description: 'Playing area length (metric).', group: 'content'}),
    defineField({name: 'width', type: 'sourcedFact', description: 'Playing area width (metric).', group: 'content'}),
    defineField({name: 'hasNet', type: 'boolean', initialValue: true, group: 'content'}),
    defineField({name: 'walls', type: 'string', options: {list: ['none', 'enclosed', 'front-wall', 'four-walls']}, initialValue: 'none', group: 'content'}),
    defineField({name: 'surface', type: 'string', group: 'content'}),
    defineField({name: 'markings', type: 'array', of: [{type: 'courtMarking'}], description: 'Lines used to draw the court to scale.', group: 'content'}),
    defineField({name: 'specs', title: 'Other specifications', type: 'array', of: [{type: 'specRow'}], group: 'content'}),
    ...commonFields('courts'),
  ],
})
