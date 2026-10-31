import {defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

/** A player rating or level system (UTR, DUPR, Playtomic level …). Part of the Players section. Not a world ranking. */
export const ratingSystem = defineType({
  name: 'ratingSystem',
  title: 'Rating or level system',
  type: 'document',
  description: 'A rating page at /ratings/<slug>/, listed in the comparison table on /ratings/ and under Ratings and levels on each of its sports’ Players tab. For systems that give a player a number or level, not world rankings. No website link on purpose.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The page heading and the name in lists, e.g. "Universal Tennis Rating".', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'acronym', type: 'string', description: 'Shown in brackets after the name, e.g. "(UTR)". Leave empty if it is the same as the name.', group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'summary', type: 'text', rows: 4, description: 'Answer-first, our own words: what it is, who runs it, its scale and how a rating is set. Shown under the heading, on its card in lists, and as the Google description.', group: 'content'}),
    defineField({name: 'operatorFact', title: 'Run by', type: 'sourcedFact', description: 'Key facts: "Run by", and the "Run by" column on /ratings/.', group: 'content'}),
    defineField({name: 'operator', type: 'reference', to: [{type: 'governingBody'}], description: 'Optional: the governing body that runs it, when it has a page here. Linked from the rating page.', group: 'links'}),
    defineField({name: 'scale', type: 'sourcedFact', description: 'Key facts: "Scale", e.g. "1.00 to 16.50, higher is stronger". Also the Scale column on /ratings/.', group: 'content'}),
    defineField({name: 'basis', title: 'How it is set', type: 'sourcedFact', description: 'Key facts: "How it is set", e.g. "Calculated from match results" or "Self-assessed against written descriptions". Also a column on /ratings/.', group: 'content'}),
    defineField({name: 'formats', title: 'Covers', type: 'sourcedFact', description: 'Key facts: "Covers", e.g. "Singles and doubles".', group: 'content'}),
    defineField({name: 'launched', type: 'sourcedFact', description: 'Key facts: "Launched". A year.', group: 'content'}),
    defineField({name: 'cost', title: 'Cost to players', type: 'sourcedFact', description: 'Key facts: "Cost to players". Only what the operator states.', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], description: 'Lists it under Ratings and levels on each sport’s Players tab, and in the Sports column on /ratings/.', validation: (r) => r.min(1), group: 'links'}),
    ...commonFields('players'),
  ],
  preview: {select: {title: 'name', subtitle: 'acronym'}},
})
