import {defineField, defineType} from 'sanity'
import {commonFields, groups, ref} from '../common'

export const competition = defineType({
  name: 'competition',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'summary', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], validation: (r) => r.min(1), group: 'links'}),
    defineField({name: 'level', type: 'string', options: {list: ['professional-tour', 'major', 'international-team', 'national', 'amateur', 'junior', 'masters']}, group: 'content'}),
    defineField({name: 'isTour', type: 'boolean', group: 'content'}),
    defineField({name: 'organiser', type: 'reference', to: [{type: 'governingBody'}], group: 'links'}),
    defineField({name: 'organiserFact', title: 'Organiser (sourced)', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'founded', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'format', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'frequency', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'venue', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'website', type: 'webLink', group: 'content'}),
    ...commonFields('competitions'),
  ],
})
