import {defineField, defineType} from 'sanity'

/** One row of a spec table: a label and a sourced value. */
export const specRow = defineType({
  name: 'specRow',
  title: 'Specification',
  type: 'object',
  fields: [
    defineField({name: 'key', type: 'string', description: 'Stable machine key, e.g. "length", "width", "weight", "diameter", "heightCentre".'}),
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'fact', type: 'sourcedFact', validation: (r) => r.required()}),
  ],
  preview: {
    select: {title: 'label', text: 'fact.text', value: 'fact.measurement.value', unit: 'fact.measurement.unit', unverified: 'fact.unverified'},
    prepare: ({title, text, value, unit, unverified}) => ({
      title,
      subtitle: (text ?? (value != null ? `${value} ${unit}` : '')) + (unverified ? ' ⚠ unverified' : ''),
    }),
  },
})
