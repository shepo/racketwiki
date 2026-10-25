import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

export const brand = defineType({
  name: 'brand',
  type: 'document',
  description: 'A brand page at /brands/<slug>/, listed on /brands/ and on the Brands tab of each sport it covers.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The page heading and the name in lists.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Our own words. Shown under the heading, on its card in lists, and as the Google description.', group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'country', type: 'sourcedFact', description: 'Key facts: "Based in". Also shown on its card on the sport\u2019s Brands tab.', group: 'content'}),
    defineField({name: 'founded', type: 'sourcedFact', description: 'Key facts: "Founded".', group: 'content'}),
    defineField({name: 'parentCompany', type: 'sourcedFact', description: 'Key facts: "Parent company".', group: 'content'}),
    defineField({name: 'website', type: 'webLink', description: 'Key facts: "Website".', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], description: 'Puts the brand on each sport\u2019s Brands tab and groups it under them on /brands/.', group: 'links'}),
    defineField({
      name: 'products',
      type: 'array',
      description: 'What it makes. Each entry is a key facts row, labelled with its category.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'category', type: 'string', description: 'e.g. Rackets, Balls, Strings, Shoes. The row label.'}),
            defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], description: 'For editors; not shown.'}),
            defineField({name: 'fact', type: 'sourcedFact', description: 'e.g. text "Makes padel rackets and balls".'}),
          ],
          preview: {select: {title: 'category', subtitle: 'sport.name'}},
        }),
      ],
    }),
    ...commonFields('brands'),
  ],
})
