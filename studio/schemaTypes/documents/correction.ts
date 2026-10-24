import {defineField, defineType} from 'sanity'

/**
 * Studio-only. Created as a draft by the submissions Worker when an editor approves
 * a "Spotted a mistake" report. Never rendered on the site.
 */
export const correction = defineType({
  name: 'correction',
  title: 'Correction report',
  type: 'document',
  fields: [
    defineField({name: 'pageUrl', type: 'string', readOnly: true}),
    defineField({name: 'message', type: 'text', readOnly: true}),
    defineField({name: 'suggestedSource', type: 'string', readOnly: true}),
    defineField({name: 'submittedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'submissionId', type: 'string', readOnly: true}),
    defineField({name: 'status', type: 'string', options: {list: ['open', 'fixed', 'rejected']}, initialValue: 'open'}),
    defineField({name: 'editorNote', type: 'text'}),
  ],
  preview: {select: {title: 'pageUrl', subtitle: 'status'}},
})
