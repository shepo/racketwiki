import {defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

/** A famous venue: a stadium, club or court known for a sport. Part of the Courts section. */
export const venue = defineType({
  name: 'venue',
  title: 'Famous venue',
  type: 'document',
  description: 'A venue page at /venues/<slug>/, listed under Famous venues on each of its sports’ Courts tab and on /courts/.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The page heading and the name in lists, e.g. "All England Lawn Tennis and Croquet Club".', validation: (r) => r.required(), group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first, our own words: what it is and why it is famous. Shown under the heading, on its card in lists, and as the Google description.', group: 'content'}),
    defineField({name: 'photo', type: 'photo', description: 'Shown under the heading on the venue page (cropped 4:3).', group: 'content'}),
    defineField({name: 'city', type: 'sourcedFact', description: 'Key facts: "City", e.g. "London".', group: 'content'}),
    defineField({name: 'country', type: 'sourcedFact', description: 'Key facts: "Country". Also shown on its card.', group: 'content'}),
    defineField({name: 'opened', type: 'sourcedFact', description: 'Key facts: "Opened". Year, or ISO date.', group: 'content'}),
    defineField({name: 'capacity', type: 'sourcedFact', description: 'Key facts: "Capacity", in text, e.g. "14,979 (Centre Court)". Name the court when there are several.', group: 'content'}),
    defineField({name: 'surface', type: 'sourcedFact', description: 'Key facts: "Surface", e.g. "Grass", "Red clay".', group: 'content'}),
    defineField({name: 'website', type: 'webLink', description: 'Key facts: "Website".', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], description: 'Puts the venue under Famous venues on each sport’s Courts tab.', validation: (r) => r.min(1), group: 'links'}),
    defineField({name: 'competitions', type: 'array', of: [ref('competition')], description: 'Competitions held here. Listed on the venue page, and the venue is listed on each competition’s page.', group: 'links'}),
    ...commonFields('courts'),
  ],
})
