/**
 * rel for a directory listing's website link (CLAUDE.md section 8).
 * Paid or owner-affiliated: sponsored. Submitted through the public form: ugc, so Google
 * gives it no credit, unless an editor has ticked "Vouched for". Added by us: followed.
 */
export function listingRel(d = {}) {
  if (d.sponsored) return 'sponsored noopener'
  if (d.submitted && !d.vouched) return 'ugc noopener'
  return 'noopener'
}
