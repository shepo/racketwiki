import {defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

export const governingBody = defineType({
  name: 'governingBody',
  title: 'Governing body',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'acronym', type: 'string', group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'scope', type: 'string', options: {list: ['international', 'continental', 'national', 'tour', 'coaching', 'association']}, group: 'content'}),
    defineField({name: 'summary', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], group: 'links'}),
    defineField({name: 'founded', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'headquarters', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'members', title: 'Member nations', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'website', type: 'webLink', group: 'content'}),
    defineField({name: 'rulebook', type: 'reference', to: [{type: 'source'}], group: 'links'}),
    ...commonFields('governing-bodies'),
  ],
})
