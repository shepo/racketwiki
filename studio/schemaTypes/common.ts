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
      description: 'The last part of the page address, e.g. "padel" in /sports/padel/. Changing it moves the page: put the old slug in Previous slugs (where offered) so old links redirect.',
      validation: (r) => r.required(),
      group: 'meta',
    }),
    defineField({
      name: 'section',
      type: 'string',
      options: {list: SECTIONS.map(({title, value}) => ({title, value}))},
      initialValue: section,
      description: 'Which of the ten sections this belongs to. Sets its colour and the search filter it appears under.',
      readOnly: true,
      group: 'meta',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Content last updated',
      type: 'datetime',
      description: 'Set when facts change, not for typo fixes. Not shown on pages yet; guides send it to Google as the modified date. Pages show "Verified <date>" from the newest Verified on date among their facts instead.',
      group: 'meta',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      description: 'Optional. Overrides the title and description Google shows. Used on brand, player, competition, governing body and guide pages; other pages write their own.',
      group: 'meta',
    }),
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
    defineField({
      name: 'alsoKnownAs',
      title: 'Also known as',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Other current names and abbreviations. Shown under the page heading ("Also known as …") and in the at-a-glance box on sport pages. Searchable.',
      group: 'content',
    }),
    defineField({
      name: 'formerNames',
      title: 'Former names',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Old names. Shown as "Formerly …" under the heading, and the first one is added to the name in lists, e.g. "World Tennis (formerly the International Tennis Federation)".',
      group: 'content',
    }),
    defineField({
      name: 'nameChange',
      title: 'Name change (sourced)',
      type: 'sourcedFact',
      description: 'Source for a rename, e.g. "Rebranded as World Tennis". Shown as the "Name" row in the key facts table on governing body pages.',
      group: 'content',
    }),
    defineField({
      name: 'previousSlugs',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Old URL slugs. The site redirects them here, so links keep working after a rename. Works for sports, governing bodies, brands, competitions and players.',
      group: 'meta',
    }),
  ]
}

/** Editorial importance, 1 to 5 rackets. Orders lists and the front page. Not a fact, so no source. */
export function importanceField() {
  return defineField({
    name: 'importance',
    title: 'Importance (1–5 rackets)',
    type: 'number',
    options: {list: [1, 2, 3, 4, 5], layout: 'radio', direction: 'horizontal'},
    description: 'Editorial judgement of how significant this is across racket sports. 5 = major, 1 = niche. Shown as rackets beside the name on its page and in lists. Higher numbers come first in lists; for sports, the eight highest make the By sport list on the front page, and the top six rated 3 or less fill "Beyond the big six".',
    validation: (r) => r.min(1).max(5).integer(),
    group: 'content',
  })
}
