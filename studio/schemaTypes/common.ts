import {defineField} from 'sanity'

export const SECTIONS = [
  {title: 'Sports', value: 'sports', color: '#0a6b4c'},
  {title: 'Rules', value: 'rules', color: '#1d4ed8'},
  {title: 'Equipment', value: 'equipment', color: '#9a4a00'},
  {title: 'Courts', value: 'courts', color: '#6d28d9'},
  {title: 'Brands', value: 'brands', color: '#be185d'},
  {title: 'Players', value: 'players', color: '#0e7490'},
  {title: 'Competitions', value: 'competitions', color: '#4d7c0f'},
  {title: 'Governing bodies', value: 'governing-bodies', color: '#b91c1c'},
  {title: 'Directory', value: 'directory', color: '#7a6200'},
  {title: 'Sources', value: 'sources', color: '#475569'},
] as const

export type SectionValue = (typeof SECTIONS)[number]['value']

/** Fields every document carries: slug, seo, section and updatedAt. */
export function commonFields(section: SectionValue, slugSource = 'name') {
  return [
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: slugSource, maxLength: 96},
      validation: (r) => r.required(),
      group: 'meta',
    }),
    defineField({
      name: 'section',
      type: 'string',
      options: {list: SECTIONS.map(({title, value}) => ({title, value}))},
      initialValue: section,
      readOnly: true,
      group: 'meta',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Content last updated',
      type: 'datetime',
      description: 'Shown on the page. Set when facts change, not for typo fixes.',
      group: 'meta',
    }),
    defineField({name: 'seo', type: 'seo', group: 'meta'}),
  ]
}

export const groups = [
  {name: 'content', title: 'Content', default: true},
  {name: 'links', title: 'Links'},
  {name: 'meta', title: 'Slug & SEO'},
]

export const ref = (...types: string[]) => ({type: 'reference' as const, to: types.map((type) => ({type}))})

/**
 * Names that point at the same thing: renames (World Tennis, formerly the ITF), local names
 * (Racketball for Squash 57) and abbreviations. All are shown on the page and searchable.
 * `previousSlugs` makes old URLs redirect to this page after a rename.
 */
export function nameFields() {
  return [
    defineField({name: 'alsoKnownAs', title: 'Also known as', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'formerNames', title: 'Former names', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'nameChange', title: 'Name change (sourced)', type: 'sourcedFact', description: 'Source for a rename, e.g. "Rebranded as World Tennis".', group: 'content'}),
    defineField({
      name: 'previousSlugs',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Old URL slugs. The site redirects them here, so links keep working after a rename.',
      group: 'meta',
    }),
  ]
}
