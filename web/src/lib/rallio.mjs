/**
 * Editorial links to rallio.io (CLAUDE.md section 6): plain links in the body of a page, used
 * only where they help the reader do what the paragraph is about. Not sponsored placements,
 * so no rel="sponsored" and no nofollow. Sponsor placements stay data in Sanity.
 *
 * Rules (checked by rallio.test.mjs): only URLs in ALLOWED, full URL with its trailing
 * slash, no UTM tags, at most 2 per page, anchor text describes the target page.
 */

/** The only rallio.io pages we link to editorially. Check each returns 200 before adding one. */
export const ALLOWED = new Set([
  'https://rallio.io/',
  'https://rallio.io/mixers/',
  'https://rallio.io/blog/how-to-run-a-social-tennis-mixer/',
  'https://rallio.io/tools/round-robin-generator/',
  'https://rallio.io/for-coaches/',
  'https://rallio.io/blog/coaches-build-a-community-of-players/',
  'https://rallio.io/community/',
  'https://rallio.io/for-groups/',
  'https://rallio.io/open-games/',
  'https://rallio.io/blog/finding-a-partner-shouldnt-be-this-hard/',
  'https://rallio.io/blog/stop-saying-sorry-ability-levels-and-ratings/',
  'https://rallio.io/blog/handicap-tournaments-tennis-and-squash/',
  'https://rallio.io/ladders/',
  'https://rallio.io/tennis/ladder/',
  'https://rallio.io/squash/ladder/',
  'https://rallio.io/pickleball/ladder/',
  'https://rallio.io/blog/how-to-manage-tennis-ladder-rankings/',
  'https://rallio.io/blog/singles-vs-doubles-ladders/',
  'https://rallio.io/box-leagues/',
  'https://rallio.io/squash/box-league/',
  'https://rallio.io/blog/how-to-run-a-squash-box-league/',
  'https://rallio.io/blog/box-league-points-systems-explained/',
  'https://rallio.io/competitions/',
  'https://rallio.io/tennis/tournament/',
  'https://rallio.io/padel/tournament/',
  'https://rallio.io/blog/how-to-seed-a-club-tournament/',
  'https://rallio.io/tools/knockout-bracket-generator/',
  'https://rallio.io/tennis/',
  'https://rallio.io/padel/',
  'https://rallio.io/pickleball/',
  'https://rallio.io/squash/',
])

/**
 * Links in the Formats section of a sport's Overview page, keyed by sport slug.
 * `format` attaches the sentence to that format's line (matched by name); without it, or when
 * the format is not on the page, the sentence follows the `group` (game | social | competitive | cultural).
 */
export const FORMAT_LINKS = {
  tennis: [
    {group: 'social', before: 'Organising a social evening at a club? Read ', anchor: 'how to run a social tennis mixer', after: '.', url: 'https://rallio.io/blog/how-to-run-a-social-tennis-mixer/'},
    {group: 'competitive', before: 'For a ranking within a club, read ', anchor: 'how tennis ladder rankings work', after: '.', url: 'https://rallio.io/blog/how-to-manage-tennis-ladder-rankings/'},
  ],
  padel: [
    {group: 'social', format: 'Americano', before: 'To make the draw, use a ', anchor: 'round robin and Americano generator', after: '.', url: 'https://rallio.io/tools/round-robin-generator/'},
    {group: 'competitive', format: 'Tournaments', before: 'See how to ', anchor: 'run a padel tournament', after: ' at a club.', url: 'https://rallio.io/padel/tournament/'},
  ],
  pickleball: [
    {group: 'social', format: 'Open play', before: 'See how to ', anchor: 'run pickleball open play with fair rotations', after: '.', url: 'https://rallio.io/pickleball/'},
    {group: 'competitive', before: 'For a ranking within a club or group, see how to ', anchor: 'run a pickleball ladder', after: '.', url: 'https://rallio.io/pickleball/ladder/'},
  ],
  squash: [
    {group: 'competitive', format: 'Box leagues', before: 'Read ', anchor: 'how to run a squash box league', after: '.', url: 'https://rallio.io/blog/how-to-run-a-squash-box-league/'},
    {group: 'competitive', format: 'Ladders', before: 'See how to ', anchor: 'run a squash ladder', after: '.', url: 'https://rallio.io/squash/ladder/'},
  ],
  badminton: [
    {group: 'social', before: 'Organising a club doubles evening? See how to ', anchor: 'run a social doubles mixer', after: '.', url: 'https://rallio.io/mixers/'},
  ],
  racquetball: [
    {group: 'competitive', format: 'Challenge ladders', before: 'See how to ', anchor: 'run a challenge ladder', after: '.', url: 'https://rallio.io/ladders/'},
  ],
}

/** Links on other single pages, keyed by path. */
export const PAGE_LINKS = {
  '/ratings/': [
    {before: 'For how clubs use levels to make games fair, read ', anchor: 'why racket sports need ability levels', after: '.', url: 'https://rallio.io/blog/stop-saying-sorry-ability-levels-and-ratings/'},
  ],
}

/** Split the format links for one sport into those on a named format line and those after a group. */
export function formatLinksFor(slug, formats = []) {
  const names = new Set(formats.map((f) => f?.name))
  const byFormat = new Map()
  const byGroup = new Map()
  for (const l of FORMAT_LINKS[slug] ?? []) {
    if (l.format && names.has(l.format)) byFormat.set(l.format, [...(byFormat.get(l.format) ?? []), l])
    else byGroup.set(l.group, [...(byGroup.get(l.group) ?? []), l])
  }
  return {byFormat, byGroup}
}
