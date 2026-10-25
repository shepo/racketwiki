import {defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

export const governingBody = defineType({
  name: 'governingBody',
  title: 'Governing body',
  type: 'document',
  description: 'A governing body page at /governing-bodies/<slug>/, listed on /governing-bodies/ and on the Organisations tab of each sport.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The page heading and the name in lists.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'acronym', type: 'string', description: 'Shown in brackets after the name, e.g. "(FIP)". Leave empty if it is the same as the name.', group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'scope', type: 'string', options: {list: ['international', 'continental', 'national', 'tour', 'coaching', 'association']}, description: 'Groups it on the sport\u2019s Organisations tab and on /governing-bodies/ (World governing body, Professional tours, Continental, National, Coaching). International bodies also appear in "Who governs what" on the front page. Shown as Scope in key facts.', group: 'content'}),
    defineField({
      name: 'region',
      type: 'string',
      options: {list: [{title: 'Africa', value: 'africa'}, {title: 'Americas', value: 'americas'}, {title: 'Asia', value: 'asia'}, {title: 'Europe', value: 'europe'}, {title: 'Oceania', value: 'oceania'}]},
      description: 'Continental and national bodies only: the region they are listed under on the Organisations tab and /governing-bodies/ (the continental association first, then national federations). Empty puts them under "Other national federations".',
      hidden: ({document}) => document?.scope !== 'continental' && document?.scope !== 'national',
      group: 'content',
    }),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Our own words. Shown under the heading, on its card in lists, and as the Google description.', group: 'content'}),
    defineField({name: 'sports', type: 'array', of: [ref('sport')], description: 'Puts it on each sport\u2019s Organisations tab and in its Governing body row.', group: 'links'}),
    defineField({name: 'founded', type: 'sourcedFact', description: 'Key facts: "Founded".', group: 'content'}),
    defineField({name: 'headquarters', type: 'sourcedFact', description: 'Key facts: "Headquarters".', group: 'content'}),
    defineField({name: 'members', title: 'Member nations', type: 'sourcedFact', description: 'Key facts: "Members".', group: 'content'}),
    defineField({name: 'website', type: 'webLink', description: 'Key facts: "Website", and the Website column on the front page.', group: 'content'}),
    defineField({name: 'rulebook', type: 'reference', to: [{type: 'source'}], description: 'Key facts: "Rulebook", linked to its entry on /sources/.', group: 'links'}),
    ...commonFields('governing-bodies'),
  ],
})
