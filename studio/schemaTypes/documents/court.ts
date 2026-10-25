import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const court = defineType({
  name: 'court',
  title: 'Court',
  type: 'document',
  description: 'Shown on the sport\u2019s Courts tab (/sports/<slug>/courts/), on its Overview, and in the to-scale comparison on /courts/.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'e.g. "Padel court", "Tennis court (doubles)". The heading on the Courts tab and the caption under the drawing.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], validation: (r) => r.required(), group: 'links'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first, e.g. "A padel court is 20 m long and 10 m wide…". Shown under the heading of the Courts tab (for the sport\u2019s main court).', group: 'content'}),
    defineField({
      name: 'standard',
      type: 'boolean',
      initialValue: true,
      description: 'Untick for sports where every venue differs (real tennis, rackets). The court is then not drawn: the note below is shown instead, and the court is listed under "Courts that are not standard" on /courts/.',
      group: 'content',
    }),
    defineField({name: 'nonStandardNote', type: 'text', rows: 3, description: 'Why there is no standard size. Shown in place of the drawing and on /courts/.', hidden: ({document}) => document?.standard !== false, group: 'content'}),
    defineField({name: 'length', type: 'sourcedFact', description: 'Playing area length (metric). With Width, this draws the court, gives the Court row in the sport\u2019s At a glance box, and places it in the /courts/ comparison.', group: 'content'}),
    defineField({name: 'width', type: 'sourcedFact', description: 'Playing area width (metric). Needed with Length for the drawing and comparisons.', group: 'content'}),
    defineField({name: 'hasNet', type: 'boolean', initialValue: true, description: 'Draws a net across the middle of the court drawings. Untick for wall games such as squash.', group: 'content'}),
    defineField({name: 'walls', type: 'string', options: {list: ['none', 'enclosed', 'front-wall', 'four-walls']}, initialValue: 'none', description: 'Not shown on the site yet.', group: 'content'}),
    defineField({name: 'surface', type: 'string', description: 'Not shown on the site yet.', group: 'content'}),
    defineField({name: 'markings', type: 'array', of: [{type: 'courtMarking'}], description: 'Lines used to draw the court to scale (service lines, centre lines …). Without them the drawing shows only the outline and net.', group: 'content'}),
    defineField({name: 'specs', title: 'Other specifications', type: 'array', of: [{type: 'specRow'}], description: 'Not shown on the site yet: the Courts tab table lists only length and width.', group: 'content'}),
    ...commonFields('courts'),
  ],
})
