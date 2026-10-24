import {defineField, defineType} from 'sanity'

/** Metric only. Imperial is derived at build (web/src/lib/units.ts). Never store both. */
export const measurement = defineType({
  name: 'measurement',
  type: 'object',
  options: {columns: 3},
  fields: [
    defineField({name: 'value', type: 'number', validation: (r) => r.required()}),
    defineField({
      name: 'valueTo',
      title: 'Up to (for ranges)',
      type: 'number',
    }),
    defineField({
      name: 'unit',
      type: 'string',
      options: {list: ['mm', 'cm', 'm', 'g', 'kg']},
      validation: (r) => r.required(),
    }),
  ],
})
