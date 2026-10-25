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
      description: 'Use for facts that are not a measurement, e.g. "Underhand serve, at or below the waist". This is the text readers see wherever the fact appears. If a measurement is also filled in, the measurement is shown instead.',
    }),
    defineField({
      name: 'measurement',
      title: 'Value (measurement)',
      type: 'measurement',
      description: 'Use for sizes and weights. Metric only: the site adds the imperial figure, e.g. 20 m becomes "20 m (65 ft 7 in)". Also used to draw courts to scale and to fill the comparison tables on the Equipment and Courts pages.',
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
      description: 'How the number reads on the site: Maximum shows "up to 20 m", Minimum "at least", Range uses Up to, About "about".',
      hidden: ({parent}) => !parent?.measurement,
    }),
    defineField({
      name: 'source',
      type: 'reference',
      to: [{type: 'source'}],
      description: 'Required before the fact is shown. Named beside the fact (or in the Source column), listed under Sources at the foot of the page, and linked to its entry on the Sources page.',
    }),
    defineField({
      name: 'citation',
      type: 'string',
      description: 'Where in the source, e.g. "Rule 1, Appendix I" or "Section 2.1". Shown after the source name.',
    }),
    defineField({
      name: 'tier',
      type: 'number',
      options: {list: [1, 2, 3, 4, 5]},
      description: '1 governing body / rulebook … 5 press and community. Normally the tier of the source. Shown as "tier N" beside rules points and linked to the tier explanation on the Sources page.',
      validation: (r) => r.min(1).max(5).integer(),
    }),
    defineField({
      name: 'verifiedOn',
      title: 'Verified on',
      type: 'date',
      description: 'When someone last checked this against the source. The newest date among a page\u2019s facts is shown as "Verified <date>" under its heading.',
    }),
    defineField({
      name: 'unverified',
      type: 'boolean',
      initialValue: false,
      description: 'Tick when we do not know this yet. The site shows "Being verified" in its place, and it appears in the Needs verification list in the Studio. Untick it (with a source, tier and date) to publish the fact.',
    }),
    defineField({
      name: 'editorNote',
      type: 'text',
      rows: 2,
      description: 'Studio only, never shown on the site. What still needs checking, conflicting sources, etc.',
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
