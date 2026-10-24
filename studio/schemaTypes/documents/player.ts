import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const player = defineType({
  name: 'player',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], validation: (r) => r.required(), group: 'links'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first: who they are, in our words.', group: 'content'}),
    defineField({name: 'nationality', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'born', type: 'sourcedFact', description: 'Text, ISO date: "1990-05-02".', group: 'content'}),
    defineField({name: 'plays', type: 'sourcedFact', description: 'e.g. "Right-handed", "Drive side".', group: 'content'}),
    defineField({name: 'ranking', title: 'Ranking (with date)', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'highlights', type: 'array', of: [{type: 'sourcedFact'}], group: 'content'}),
    defineField({name: 'competitions', type: 'array', of: [{type: 'reference', to: [{type: 'competition'}]}], group: 'links'}),
    defineField({name: 'brands', title: 'Equipment sponsors', type: 'array', of: [{type: 'reference', to: [{type: 'brand'}]}], group: 'links'}),
    ...commonFields('players'),
  ],
})
