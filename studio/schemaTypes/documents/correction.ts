import {defineField, defineType} from 'sanity'

/**
 * Studio-only. Created as a draft by the submissions Worker when an editor approves
 * a "Spotted a mistake" report. Never rendered on the site.
 */
export const correction = defineType({
  name: 'correction',
  title: 'Correction report',
  type: 'document',
  description: 'A reader\u2019s "Spotted a mistake" report, approved in the submissions admin. Studio only: fix the page it names, then set Status.',
  fields: [
    defineField({name: 'issueType', type: 'string', readOnly: true, options: {list: ['wrong', 'newer-edition', 'missing', 'renamed', 'other']}}),
    defineField({name: 'pageUrl', type: 'string', readOnly: true}),
    defineField({name: 'message', type: 'text', readOnly: true}),
    defineField({name: 'suggestedSource', type: 'string', readOnly: true}),
    defineField({name: 'submittedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'submissionId', type: 'string', readOnly: true}),
    defineField({name: 'status', type: 'string', options: {list: ['open', 'fixed', 'rejected']}, initialValue: 'open', description: 'Your progress on it. Nothing on the site changes.'}),
    defineField({name: 'editorNote', type: 'text', description: 'Studio only.'}),
  ],
  preview: {select: {title: 'pageUrl', subtitle: 'issueType'}},
})
