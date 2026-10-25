import {defineField, defineType} from 'sanity'

/** One row of a spec table: a label and a sourced value. */
export const specRow = defineType({
  name: 'specRow',
  title: 'Specification',
  type: 'object',
  fields: [
    defineField({name: 'key', type: 'string', description: 'Puts this row in the cross-sport comparison tables on the Equipment pages. Rackets, paddles and bats: length, width, weight. Balls and shuttles: diameter, weight. Nets: heightCentre, heightPosts. Any other key (or none) shows only on this sport\u2019s Equipment tab.'}),
    defineField({name: 'label', type: 'string', description: 'The row name readers see, e.g. "Maximum length".', validation: (r) => r.required()}),
    defineField({name: 'fact', type: 'sourcedFact', description: 'The value and its source, shown in the Detail and Source columns.', validation: (r) => r.required()}),
  ],
  preview: {
    select: {title: 'label', text: 'fact.text', value: 'fact.measurement.value', unit: 'fact.measurement.unit', unverified: 'fact.unverified'},
    prepare: ({title, text, value, unit, unverified}) => ({
      title,
      subtitle: (text ?? (value != null ? `${value} ${unit}` : '')) + (unverified ? ' ⚠ unverified' : ''),
    }),
  },
})
