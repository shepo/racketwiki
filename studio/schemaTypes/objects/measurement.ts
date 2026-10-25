import {defineField, defineType} from 'sanity'

/** Metric only. Imperial is derived at build (web/src/lib/units.ts). Never store both. */
export const measurement = defineType({
  name: 'measurement',
  type: 'object',
  options: {columns: 3},
  fields: [
    defineField({name: 'value', type: 'number', description: 'The number, in the unit chosen here.', validation: (r) => r.required()}),
    defineField({
      name: 'valueTo',
      title: 'Up to (for ranges)',
      type: 'number',
      description: 'Only for ranges, e.g. 56 to 59.4 g. Set the qualifier to Range.',
    }),
    defineField({
      name: 'unit',
      type: 'string',
      options: {list: ['mm', 'cm', 'm', 'g', 'kg']},
      description: 'Metric only. Imperial is added on the site.',
      validation: (r) => r.required(),
    }),
  ],
})
