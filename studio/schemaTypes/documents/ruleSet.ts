import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const ruleSet = defineType({
  name: 'ruleSet',
  title: 'Rule set',
  type: 'document',
  description: 'A sport\u2019s rules summary: its Rules tab (/sports/<slug>/rules/), a card on /rules/, and "How it is played" on the sport\u2019s Overview.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'e.g. "Padel rules summary". Studio label; the page heading is "<Sport>: rules".', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], description: 'The sport whose Rules tab this fills.', validation: (r) => r.required(), group: 'links'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first: how the game is played in two or three sentences. Shown under the heading of the Rules tab, on the sport\u2019s card on /rules/, and as "How it is played" on its Overview.', group: 'content'}),
    defineField({name: 'rulebook', type: 'reference', to: [{type: 'source'}], description: 'The official rulebook this summarises. For editors; each point carries its own source on the page.', group: 'links'}),
    defineField({
      name: 'sections',
      type: 'array',
      description: 'Each section is a heading on the Rules tab with its points listed beneath, in this order.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'ruleSection',
          fields: [
            defineField({name: 'heading', type: 'string', description: 'e.g. Serve, Scoring, Lets and faults. Shown as the section heading.'}),
            defineField({name: 'key', type: 'string', options: {list: ['serve', 'scoring', 'rally', 'faults', 'walls', 'doubles', 'other']}, description: 'Choose serve for the serve section: its first point appears in "The serve, sport by sport" table on /rules/.'}),
            defineField({name: 'points', type: 'array', of: [{type: 'sourcedFact'}], description: 'One rule each, in our own words, with its source and tier shown underneath.'}),
          ],
          preview: {select: {title: 'heading'}},
        }),
      ],
    }),
    ...commonFields('rules'),
  ],
})
