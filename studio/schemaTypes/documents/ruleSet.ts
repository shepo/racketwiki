import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const ruleSet = defineType({
  name: 'ruleSet',
  title: 'Rule set',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'e.g. "Padel rules summary"', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], validation: (r) => r.required(), group: 'links'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first: how the game is played in two or three sentences.', group: 'content'}),
    defineField({name: 'rulebook', type: 'reference', to: [{type: 'source'}], group: 'links'}),
    defineField({
      name: 'sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'ruleSection',
          fields: [
            defineField({name: 'heading', type: 'string', description: 'e.g. Serve, Scoring, Lets and faults'}),
            defineField({name: 'key', type: 'string', options: {list: ['serve', 'scoring', 'rally', 'faults', 'walls', 'doubles', 'other']}}),
            defineField({name: 'points', type: 'array', of: [{type: 'sourcedFact'}]}),
          ],
          preview: {select: {title: 'heading'}},
        }),
      ],
    }),
    ...commonFields('rules'),
  ],
})
