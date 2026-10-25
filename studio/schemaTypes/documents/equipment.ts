import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

const specFields = (section: 'equipment') => [
  defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
  defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], validation: (r) => r.required(), group: 'links'}),
  defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first one-liner.', group: 'content'}),
  defineField({name: 'specs', type: 'array', of: [{type: 'specRow'}], group: 'content'}),
  defineField({name: 'photo', type: 'photo', group: 'content'}),
  ...commonFields(section),
]

export const equipmentSpec = defineType({
  name: 'equipmentSpec',
  title: 'Equipment spec (racket, paddle, bat)',
  type: 'document',
  groups,
  fields: [
    defineField({
      name: 'item',
      type: 'string',
      options: {list: ['racket', 'paddle', 'bat', 'strings', 'shuttle', 'table', 'other']},
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
  groups,
  fields: specFields('equipment'),
})

export const net = defineType({
  name: 'net',
  title: 'Net',
  type: 'document',
  groups,
  fields: specFields('equipment'),
})
