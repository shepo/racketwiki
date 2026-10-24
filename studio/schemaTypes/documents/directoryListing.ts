import {defineField, defineType} from 'sanity'
import {commonFields, groups, ref} from '../common'

export const DIRECTORY_TYPES = [
  {title: 'Governing bodies', value: 'governing-bodies'},
  {title: 'Brands', value: 'brands'},
  {title: 'Equipment labs', value: 'equipment-labs'},
  {title: 'Stats and records', value: 'stats-and-records'},
  {title: 'Software and apps', value: 'software-and-apps'},
  {title: 'Clubs and venues', value: 'clubs-and-venues'},
  {title: 'Coaches', value: 'coaches'},
  {title: 'Retailers', value: 'retailers'},
]

export const directoryListing = defineType({
  name: 'directoryListing',
  title: 'Directory listing',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'listingType', type: 'string', options: {list: DIRECTORY_TYPES}, validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'description', type: 'text', rows: 3, description: 'Our own words, one or two sentences.', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], group: 'links'}),
    defineField({name: 'region', type: 'string', description: 'e.g. Worldwide, United Kingdom', group: 'content'}),
    defineField({name: 'website', type: 'webLink', group: 'content'}),
    defineField({name: 'source', type: 'reference', to: [{type: 'source'}], description: 'Evidence the listing is genuine.', group: 'links'}),
    defineField({
      name: 'sponsored',
      type: 'boolean',
      initialValue: false,
      description: 'Paid or owner-affiliated listing (e.g. Rallio). Labelled "Sponsored" and linked rel="sponsored".',
      group: 'content',
    }),
    defineField({name: 'linkedDocument', type: 'reference', to: [{type: 'brand'}, {type: 'governingBody'}], group: 'links'}),
    defineField({name: 'submitted', type: 'boolean', initialValue: false, readOnly: true, description: 'Came from a public submission.', group: 'meta'}),
    ...commonFields('directory'),
  ],
  preview: {select: {title: 'name', subtitle: 'listingType', sponsored: 'sponsored'}},
})
