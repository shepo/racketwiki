import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonFields, groups, ref} from '../common'

export const sport = defineType({
  name: 'sport',
  title: 'Sport',
  type: 'document',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'alsoKnownAs', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({
      name: 'family',
      type: 'string',
      description: 'Groups sports on index pages.',
      options: {list: ['net', 'wall', 'heritage', 'beach-and-outdoor', 'table', 'other']},
      group: 'content',
    }),
    defineField({
      name: 'depth',
      type: 'string',
      options: {list: [{title: 'Full reference page', value: 'full'}, {title: 'Shallow (summary only)', value: 'shallow'}]},
      initialValue: 'shallow',
      group: 'content',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      description: 'Answer-first, one paragraph, our own words. Lead with what the sport is and its court.',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'implement', title: 'Played with', type: 'string', options: {list: ['racket', 'paddle', 'bat', 'mixed']}, group: 'content'}),
    defineField({name: 'projectile', type: 'string', options: {list: ['ball', 'shuttle']}, group: 'content'}),
    defineField({name: 'origin', type: 'sourcedFact', description: 'Where and when it began.', group: 'content'}),
    defineField({
      name: 'formats',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'format',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'kind', type: 'string', options: {list: ['singles', 'doubles', 'mixed', 'ladder', 'box-league', 'round-robin', 'team', 'other']}}),
            defineField({name: 'description', type: 'text', rows: 2}),
            defineField({name: 'fact', type: 'sourcedFact', description: 'Optional: source for an official format.'}),
          ],
          preview: {select: {title: 'name', subtitle: 'kind'}},
        }),
      ],
    }),
    defineField({name: 'body', title: 'Overview (long form)', type: 'richText', group: 'content'}),
    defineField({
      name: 'faq',
      title: 'Questions and answers',
      type: 'array',
      description: 'Only real, sourced Q&A. Emits FAQPage structured data.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', type: 'string'}),
            defineField({name: 'answer', type: 'text', rows: 3}),
            defineField({name: 'source', type: 'reference', to: [{type: 'source'}]}),
          ],
        }),
      ],
    }),
    defineField({name: 'courts', type: 'array', of: [ref('court')], group: 'links'}),
    defineField({name: 'ruleSet', type: 'reference', to: [{type: 'ruleSet'}], group: 'links'}),
    defineField({name: 'equipmentSpecs', type: 'array', of: [ref('equipmentSpec')], group: 'links'}),
    defineField({name: 'balls', type: 'array', of: [ref('ball')], group: 'links'}),
    defineField({name: 'nets', type: 'array', of: [ref('net')], group: 'links'}),
    defineField({name: 'brands', type: 'array', of: [ref('brand')], group: 'links'}),
    defineField({name: 'players', type: 'array', of: [ref('player')], group: 'links'}),
    defineField({name: 'competitions', type: 'array', of: [ref('competition')], group: 'links'}),
    defineField({name: 'governingBodies', type: 'array', of: [ref('governingBody')], group: 'links'}),
    defineField({
      name: 'governingBodyFact',
      title: 'Governing body (sourced)',
      type: 'sourcedFact',
      description: 'Use when no governingBody document exists yet, or there is no single body.',
      group: 'links',
    }),
    defineField({
      name: 'relatedSports',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}]}),
            defineField({name: 'relation', type: 'string', description: 'Short label, e.g. "Same scoring", "Walls in play".'}),
            defineField({name: 'note', type: 'string'}),
          ],
          preview: {select: {title: 'sport.name', subtitle: 'relation'}},
        }),
      ],
    }),
    ...commonFields('sports'),
  ],
  preview: {select: {title: 'name', subtitle: 'depth'}},
})
