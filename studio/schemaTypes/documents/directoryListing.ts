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
  description: 'An entry on /directory/ and on its type page, e.g. /directory/software-and-apps/.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The listing heading.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'listingType', type: 'string', options: {list: DIRECTORY_TYPES}, description: 'Which directory page it appears on, and its coloured label.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'description', type: 'text', rows: 3, description: 'Our own words, one or two sentences. Shown under the name.', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], description: 'Shown as "Sports:" beside the listing, linked to each sport.', group: 'links'}),
    defineField({name: 'region', type: 'string', description: 'e.g. Worldwide, United Kingdom. Shown as "Region:" beside the listing.', group: 'content'}),
    defineField({name: 'website', type: 'webLink', description: 'The link beside the listing ("Website being verified" until Researched).', group: 'content'}),
    defineField({name: 'source', type: 'reference', to: [{type: 'source'}], description: 'Evidence the listing is genuine. For editors; not shown.', group: 'links'}),
    defineField({
      name: 'sponsored',
      type: 'boolean',
      initialValue: false,
      description: 'Paid or owner-affiliated listing (e.g. Rallio). Labelled "Sponsored" and linked rel="sponsored".',
      group: 'content',
    }),
    defineField({name: 'linkedDocument', type: 'reference', to: [{type: 'brand'}, {type: 'governingBody'}], description: 'Makes the listing name a link to that brand or governing body page, and adds "In the directory" to that page.', group: 'links'}),
    defineField({name: 'submitted', type: 'boolean', initialValue: false, readOnly: true, description: 'Came from a public submission. Its website link is marked rel="ugc".', group: 'meta'}),
    ...commonFields('directory'),
  ],
  preview: {select: {title: 'name', subtitle: 'listingType', sponsored: 'sponsored'}},
})
