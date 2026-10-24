import {defineField, defineType} from 'sanity'

/**
 * A line on a court, used to draw the court to scale.
 * - across: parallel to the net (or the front wall), `offset` from `from`.
 * - along: parallel to the sidelines, `offset` from the centre line (0 = the centre line).
 * `mirror` repeats the line in the other half.
 */
export const courtMarking = defineType({
  name: 'courtMarking',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'kind', type: 'string', options: {list: ['across', 'along']}, validation: (r) => r.required()}),
    defineField({
      name: 'from',
      type: 'string',
      options: {list: [{title: 'Net / centre of the court', value: 'net'}, {title: 'End line / front wall', value: 'end'}]},
      initialValue: 'net',
      hidden: ({parent}) => parent?.kind !== 'across',
    }),
    defineField({name: 'offset', type: 'sourcedFact', description: 'Distance (metric).'}),
    defineField({name: 'mirror', type: 'boolean', initialValue: true}),
    defineField({name: 'inset', type: 'measurement', description: 'Across lines: stop this far in from each sideline.'}),
    defineField({name: 'start', type: 'measurement', description: 'Along lines: start this far from the net.'}),
    defineField({name: 'end', type: 'measurement', description: 'Along lines: stop this far from the net. Empty = the end line.'}),
  ],
})
