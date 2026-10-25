import {defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

export const competition = defineType({
  name: 'competition',
  type: 'document',
  description: 'A competition page at /competitions/<slug>/, listed on /competitions/ and on the Competitions tab of each sport.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The page heading and the name in lists.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Our own words. Shown under the heading, on its card on /competitions/, and as the Google description.', group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], description: 'Puts it on each sport\u2019s Competitions tab and groups it under them on /competitions/.', validation: (r) => r.min(1), group: 'links'}),
    defineField({name: 'level', type: 'string', options: {list: ['professional-tour', 'major', 'international-team', 'national', 'amateur', 'junior', 'masters']}, description: 'The Level column on the sport\u2019s Competitions tab.', group: 'content'}),
    defineField({name: 'isTour', type: 'boolean', description: 'Tick for a tour or series rather than one event. Not shown; tells Google whether it is an organisation or an event.', group: 'content'}),
    defineField({name: 'organiser', type: 'reference', to: [{type: 'governingBody'}], description: 'Key facts: "Run by", linked to its page; the Run by column on the Competitions tab; and listed under Competitions on the organiser\u2019s page.', group: 'links'}),
    defineField({name: 'organiserFact', title: 'Organiser (sourced)', type: 'sourcedFact', description: 'Key facts: "Organiser". Use when the organiser has no governing body document; the Competitions tab shows it when Organiser above is empty.', group: 'content'}),
    defineField({name: 'founded', type: 'sourcedFact', description: 'Key facts: "First held".', group: 'content'}),
    defineField({name: 'format', type: 'sourcedFact', description: 'Key facts: "Format".', group: 'content'}),
    defineField({name: 'frequency', type: 'sourcedFact', description: 'Key facts: "How often".', group: 'content'}),
    defineField({name: 'venue', type: 'sourcedFact', description: 'Key facts: "Venue".', group: 'content'}),
    defineField({name: 'website', type: 'webLink', description: 'Key facts: "Website".', group: 'content'}),
    ...commonFields('competitions'),
  ],
})
