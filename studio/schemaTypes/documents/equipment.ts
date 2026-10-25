import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

const specFields = (section: 'equipment') => [
  defineField({name: 'name', type: 'string', description: 'The heading on the sport\u2019s Equipment tab and on /equipment/<kind>/, e.g. "Padel racket".', validation: (r) => r.required(), group: 'content'}),
  defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], description: 'Puts this on that sport\u2019s Equipment tab and gives it its row in the comparison tables.', validation: (r) => r.required(), group: 'links'}),
  defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first one-liner, shown under the heading.', group: 'content'}),
  defineField({name: 'specs', type: 'array', of: [{type: 'specRow'}], description: 'The spec table under the heading. Rows with the right key also fill the comparison tables on /equipment/ (see Key on each row).', group: 'content'}),
  defineField({name: 'photo', type: 'photo', description: 'Shown beside the spec table on the sport\u2019s Equipment tab.', group: 'content'}),
  ...commonFields(section),
]

export const equipmentSpec = defineType({
  name: 'equipmentSpec',
  title: 'Equipment spec (racket, paddle, bat)',
  type: 'document',
  description: 'Shown on the sport\u2019s Equipment tab, and rackets, paddles and bats on /equipment/rackets/.',
  groups,
  fields: [
    defineField({
      name: 'item',
      type: 'string',
      options: {list: ['racket', 'paddle', 'bat', 'strings', 'shuttle', 'table', 'other']},
      description: 'What kind of kit this is. Not shown on its own.',
      validation: (r) => r.required(),
      group: 'content',
    }),
    ...specFields('equipment'),
  ],
  preview: {select: {title: 'name', subtitle: 'item'}},
})

export const ball = defineType({
  name: 'ball',
  title: 'Ball or shuttle',
  type: 'document',
  description: 'Shown on the sport\u2019s Equipment tab and on /equipment/balls/.',
  groups,
  fields: specFields('equipment'),
})

export const net = defineType({
  name: 'net',
  title: 'Net',
  type: 'document',
  description: 'Shown on the sport\u2019s Equipment tab and on /equipment/nets/.',
  groups,
  fields: specFields('equipment'),
})
