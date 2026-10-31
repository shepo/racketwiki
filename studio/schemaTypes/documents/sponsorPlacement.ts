import {defineField, defineType} from 'sanity'
import {SECTIONS} from '../common'

export const sponsorPlacement = defineType({
  name: 'sponsorPlacement',
  title: 'Sponsor placement',
  type: 'document',
  description: 'A paid or Rallio slot: the strip at the top of every page, or the sidebar card on the front page, sport Overview, Equipment and Courts tabs, and the Equipment and Courts pages. Links are labelled Sponsored.',
  fields: [
    defineField({name: 'sponsor', type: 'string', description: 'Who is paying. Studio label, and the button reads "Learn about <sponsor>" when Button label is empty.', validation: (r) => r.required()}),
    defineField({
      name: 'scope',
      type: 'string',
      options: {list: ['site', 'section', 'sport', 'page']},
      validation: (r) => r.required(),
      description: 'Where it shows. Site = every page; section = pages in one section; sport = every tab of one sport; page = one address. Where several are live, the most specific wins: page › sport › section › site.',
    }),
    defineField({name: 'section', type: 'string', options: {list: SECTIONS.map(({title, value}) => ({title, value}))}, hidden: ({document}) => document?.scope !== 'section'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], hidden: ({document}) => document?.scope !== 'sport'}),
    defineField({name: 'pagePath', type: 'string', description: 'The exact page address, e.g. /sports/padel/courts/ (with both slashes).', hidden: ({document}) => document?.scope !== 'page'}),
    defineField({
      name: 'placement',
      type: 'string',
      options: {list: [{title: 'Strip at top of page (not shown on the site)', value: 'strip'}, {title: 'Sidebar card', value: 'card'}]},
      description: 'Strip: not shown at the moment (the top bar was removed). Sidebar card: the box in the right-hand column (only on pages that have one).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'creative',
      type: 'object',
      description: 'What readers see.',
      fields: [
        defineField({name: 'headline', type: 'string', description: 'The bold line on the sidebar card. The strip shows only Body and the button.'}),
        defineField({name: 'body', type: 'string', description: 'One sentence under the headline.'}),
        defineField({name: 'ctaLabel', title: 'Button label', type: 'string', description: 'e.g. "Try Rallio".'}),
        defineField({name: 'ctaUrl', title: 'Button link', type: 'url', description: 'Where the button goes. Always linked rel="sponsored".'}),
        defineField({name: 'logo', type: 'image', description: 'Not shown yet.'}),
        defineField({name: 'theme', type: 'string', options: {list: ['rallio', 'neutral']}, initialValue: 'neutral', description: 'Rallio uses Rallio\u2019s own colours and font; Neutral uses the RacketWiki look.'}),
      ],
    }),
    defineField({name: 'start', type: 'datetime', description: 'Goes live from this time. Empty = now. Checked when the site rebuilds, not live.'}),
    defineField({name: 'end', type: 'datetime', description: 'Stops after this time. Empty = no end. Checked when the site rebuilds.'}),
  ],
  preview: {select: {title: 'sponsor', scope: 'scope', placement: 'placement'}, prepare: ({title, scope, placement}) => ({title, subtitle: `${placement} · ${scope}`})},
})
