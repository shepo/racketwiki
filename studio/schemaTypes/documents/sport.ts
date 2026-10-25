import {defineArrayMember, defineField, defineType} from 'sanity'
import {commonFields, groups, nameFields, importanceField, ref} from '../common'

export const sport = defineType({
  name: 'sport',
  title: 'Sport',
  type: 'document',
  description: 'A sport hub at /sports/<slug>/, with a tab for each section that has content (Overview, Rules, Equipment, Courts, Brands, Players, Competitions, Organisations).',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The heading on every tab of the sport, and its name in lists, search and menus.', validation: (r) => r.required(), group: 'content'}),
    ...nameFields(),
    importanceField(),
    defineField({name: 'photo', title: 'Hero photo', type: 'photo', description: 'The wide photo at the top of the Overview tab.', group: 'content'}),
    defineField({
      name: 'family',
      type: 'string',
      description: 'Which group the sport sits in on /sports/ (Net games, Wall and enclosed-court games …). Also the small label on its card in "Beyond the big six" on the front page.',
      options: {list: ['net', 'wall', 'heritage', 'beach-and-outdoor', 'table', 'other']},
      group: 'content',
    }),
    defineField({
      name: 'depth',
      type: 'string',
      options: {list: [{title: 'Full reference page', value: 'full'}, {title: 'Shallow (summary only)', value: 'shallow'}]},
      initialValue: 'shallow',
      description: 'Editor note only, not used by the site: tabs appear on their own as content is added.',
      group: 'content',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      description: 'Answer-first, one paragraph, our own words. Lead with what the sport is and its court. Shown under the heading on the Overview tab and used as the Google description. Its first sentence is the blurb on sport cards (/sports/ and the front page).',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'implement', title: 'Played with', type: 'string', options: {list: ['racket', 'paddle', 'bat', 'mixed']}, description: 'The "Played with" row in the At a glance box, e.g. "A paddle and a ball". Empty hides the row.', group: 'content'}),
    defineField({name: 'projectile', type: 'string', options: {list: ['ball', 'shuttle']}, description: 'Completes the "Played with" row. Empty reads as ball.', group: 'content'}),
    defineField({name: 'origin', type: 'sourcedFact', description: 'Where and when it began. The Origin row in the At a glance box ("Being verified" until sourced).', group: 'content'}),
    defineField({
      name: 'formats',
      type: 'array',
      description: 'Ways the sport is played (singles, doubles, box leagues …). The names make the Formats row in At a glance; each name and description is listed in the Formats section of the Overview tab.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'format',
          fields: [
            defineField({name: 'name', type: 'string', description: 'Shown in bold, e.g. "Doubles".', validation: (r) => r.required()}),
            defineField({name: 'kind', type: 'string', options: {list: ['singles', 'doubles', 'mixed', 'ladder', 'box-league', 'round-robin', 'team', 'other']}, description: 'For sorting and future filters. Not shown.'}),
            defineField({name: 'description', type: 'text', rows: 2, description: 'One sentence after the name, our own words.'}),
            defineField({name: 'fact', type: 'sourcedFact', description: 'Optional: source for an official format. Kept for editors; not shown yet.'}),
          ],
          preview: {select: {title: 'name', subtitle: 'kind'}},
        }),
      ],
    }),
    defineField({name: 'body', title: 'Overview (long form)', type: 'richText', description: 'Longer write-up, shown as "About <sport>" on the Overview tab. Optional.', group: 'content'}),
    defineField({
      name: 'faq',
      title: 'Questions and answers',
      type: 'array',
      description: 'Only real, sourced Q&A. Shown as Questions at the foot of the Overview tab and sent to Google as FAQ data. An entry without a question, answer and source is left out.',
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
    defineField({name: 'courts', type: 'array', of: [ref('court')], description: 'Fills the Courts tab. The first court that can be drawn is the main court: its size is the Court row in At a glance and its drawing is "The court" on the Overview tab. Either side can make the link: setting the sport on the court document does the same.', group: 'links'}),
    defineField({name: 'ruleSet', type: 'reference', to: [{type: 'ruleSet'}], description: 'Fills the Rules tab, and its summary is "How it is played" on the Overview tab. Either side can make the link: setting the sport on the rule set document does the same.', group: 'links'}),
    defineField({name: 'equipmentSpecs', type: 'array', of: [ref('equipmentSpec')], description: 'Rackets, paddles, bats and other kit on the Equipment tab. Either side can make the link: setting the sport on the equipment document does the same.', group: 'links'}),
    defineField({name: 'balls', type: 'array', of: [ref('ball')], description: 'Balls or shuttles on the Equipment tab. Either side can make the link: setting the sport on the ball document does the same.', group: 'links'}),
    defineField({name: 'nets', type: 'array', of: [ref('net')], description: 'Nets on the Equipment tab. Either side can make the link: setting the sport on the net document does the same.', group: 'links'}),
    defineField({name: 'brands', type: 'array', of: [ref('brand')], description: 'Fills the Brands tab; the first three also appear under People and organisations on the Overview tab. Either side can make the link: setting the sport on the brand document does the same.', group: 'links'}),
    defineField({name: 'players', type: 'array', of: [ref('player')], description: 'Fills the Players tab (grouped by tour, with nationality and number of honours); the first three also appear on the Overview tab. Either side can make the link: setting the sport on the player document does the same.', group: 'links'}),
    defineField({name: 'competitions', type: 'array', of: [ref('competition')], description: 'Fills the Competitions tab (with level and organiser); the first three also appear on the Overview tab. Either side can make the link: setting the sport on the competition document does the same.', group: 'links'}),
    defineField({name: 'governingBodies', type: 'array', of: [ref('governingBody')], description: 'Fills the Organisations tab (grouped into world, tours, continental, national and coaching) and the Governing body row in At a glance. Either side can make the link: setting the sport on the governing body document does the same.', group: 'links'}),
    defineField({
      name: 'governingBodyFact',
      title: 'Governing body (sourced)',
      type: 'sourcedFact',
      description: 'Use when no governing body document exists yet, or there is no single body. Shown in the Governing body row and on the Organisations tab only while Governing bodies above is empty.',
      group: 'links',
    }),
    defineField({
      name: 'relatedSports',
      type: 'array',
      description: 'Listed as Related sports at the foot of every tab of this sport, with the relation and note after the name. Add it on both sports if you want the link both ways.',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}]}),
            defineField({name: 'relation', type: 'string', description: 'Short label, e.g. "Same scoring", "Walls in play". Shown after the name.'}),
            defineField({name: 'note', type: 'string', description: 'Optional extra sentence, shown after the relation.'}),
          ],
          preview: {select: {title: 'sport.name', subtitle: 'relation'}},
        }),
      ],
    }),
    ...commonFields('sports'),
  ],
  preview: {select: {title: 'name', subtitle: 'depth'}},
})
