import {defineField, defineType} from 'sanity'

/**
 * A single fact that could be wrong. It carries its source, the source's tier
 * and the date it was last checked. A fact with no source must be marked
 * `unverified`; unverified facts appear in the Studio's "Needs verification"
 * list and are never rendered as fact on the public site.
 */
export const sourcedFact = defineType({
  name: 'sourcedFact',
  title: 'Sourced fact',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Value (text)',
      type: 'string',
      description: 'Use for facts that are not a measurement, e.g. "Underhand serve, at or below the waist".',
    }),
    defineField({
      name: 'measurement',
      title: 'Value (measurement)',
      type: 'measurement',
      description: 'Use for sizes and weights. Metric only; imperial is derived when the site builds.',
    }),
    defineField({
      name: 'qualifier',
      type: 'string',
      options: {
        list: [
          {title: 'Exactly', value: 'exact'},
          {title: 'Maximum', value: 'max'},
          {title: 'Minimum', value: 'min'},
          {title: 'Range', value: 'range'},
          {title: 'About', value: 'approx'},
        ],
      },
      initialValue: 'exact',
      hidden: ({parent}) => !parent?.measurement,
    }),
    defineField({name: 'source', type: 'reference', to: [{type: 'source'}]}),
    defineField({
      name: 'citation',
      type: 'string',
      description: 'Where in the source, e.g. "Rule 1, Appendix I" or "Section 2.1".',
    }),
    defineField({
      name: 'tier',
      type: 'number',
      options: {list: [1, 2, 3, 4, 5]},
      description: '1 governing body / rulebook … 5 press and community. Normally the tier of the source.',
      validation: (r) => r.min(1).max(5).integer(),
    }),
    defineField({name: 'verifiedOn', title: 'Verified on', type: 'date'}),
    defineField({
      name: 'unverified',
      type: 'boolean',
      initialValue: false,
      description: 'Tick when we do not know this yet. It will not be shown as fact on the site.',
    }),
    defineField({
      name: 'editorNote',
      type: 'text',
      rows: 2,
      description: 'Studio only. What still needs checking, conflicting sources, etc.',
    }),
  ],
  validation: (rule) =>
    rule.custom((fact: any) => {
      if (!fact) return true
      if (fact.unverified) return true
      if (!fact.text && !fact.measurement) return 'Add a value, or tick "unverified".'
      if (!fact.source) return 'A published fact needs a source. Add one, or tick "unverified".'
      if (!fact.tier) return 'Add the source tier (1–5).'
      if (!fact.verifiedOn) return 'Add the date this was verified.'
      return true
    }),
  preview: {
    select: {
      text: 'text',
      value: 'measurement.value',
      unit: 'measurement.unit',
      unverified: 'unverified',
      tier: 'tier',
      source: 'source.name',
    },
    prepare: ({text, value, unit, unverified, tier, source}) => ({
      title: (text ?? (value != null ? `${value} ${unit ?? ''}` : '—')) + (unverified ? '  ⚠ unverified' : ''),
      subtitle: unverified ? 'Needs verification' : `Tier ${tier ?? '?'} · ${source ?? 'no source'}`,
    }),
  },
})
