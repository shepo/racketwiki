import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

export const brand = defineType({
  name: 'brand',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'summary', type: 'text', rows: 3, group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'country', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'founded', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'parentCompany', type: 'sourcedFact', group: 'content'}),
    defineField({name: 'website', type: 'webLink', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], group: 'links'}),
    defineField({
      name: 'products',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'category', type: 'string', description: 'e.g. Rackets, Balls, Strings, Shoes'}),
            defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}]}),
            defineField({name: 'fact', type: 'sourcedFact', description: 'e.g. text "Makes padel rackets and balls".'}),
          ],
          preview: {select: {title: 'category', subtitle: 'sport.name'}},
        }),
      ],
    }),
    ...commonFields('brands'),
  ],
})
