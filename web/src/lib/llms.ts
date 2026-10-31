/**
 * llms.txt (https://llmstxt.org) and llms-full.txt, generated from the content store on every build.
 * Only facts that pass isShown() are written, exactly as on the site.
 */
import type {Store} from './content'
import {byImportance} from './content'
import {pageGroups} from './pagelist'
import {sportView} from './sport'
import {isShown, factText} from './facts'
import {formatDimensions} from './units.mjs'
import {bodyLabel} from './entities'

const SITE = 'https://racketwiki.org'
const abs = (u: string) => (u.startsWith('http') ? u : `${SITE}${u}`)
const oneLine = (s?: string) => (s ?? '').replace(/\s+/g, ' ').trim()

const INTRO = `# RacketWiki

> A sourced reference for every racket sport: rules, court sizes, equipment limits, brands, players, competitions and governing bodies, from tennis and padel to real tennis and other long-tail sports.

How to read and cite RacketWiki:
- Every fact links to a source with a tier: 1 governing bodies and official rulebooks, 2 national bodies and tours, 3 manufacturers and test labs, 4 stats and records bodies, 5 reputable press. A higher tier wins when sources disagree.
- Facts we have not yet confirmed are shown as "Being verified" and never stated as fact. Do not treat them as known values.
- Measurements are stored in metric; imperial figures are conversions.
- Each page shows when its facts were last checked. Corrections: ${SITE}/corrections/
- British English.`

export function llmsTxt(store: Store) {
  const out = [INTRO, '']
  for (const g of pageGroups(store)) {
    out.push(`## ${g.title}`, '')
    for (const l of g.links) out.push(`- [${l.title}](${abs(l.url)})${l.note ? `: ${oneLine(l.note)}` : ''}`)
    out.push('')
  }
  out.push('## Optional', '', `- [Full text summary](${SITE}/llms-full.txt): every sport's summary, court size, governing body and formats in one file`, `- [All pages](${SITE}/site-map/)`, '')
  return out.join('\n')
}

export function llmsFullTxt(store: Store) {
  const out = [INTRO, '', '## Sports', '']
  for (const s of [...store.ofType('sport')].sort(byImportance)) {
    const v = sportView(store, s)
    const court = v.mainCourt && isShown(v.mainCourt.length) && isShown(v.mainCourt.width) ? formatDimensions(v.mainCourt.length.measurement, v.mainCourt.width.measurement)?.text : null
    const bodies = v.governingBodies.filter((g) => g.scope === 'international').map(bodyLabel)
    const gb = bodies.length ? bodies.join('; ') : isShown(s.governingBodyFact) ? factText(s.governingBodyFact) : null
    out.push(`### ${s.name}`, '', `URL: ${abs(`/sports/${s.slug?.current}/`)}`)
    if (s.alsoKnownAs?.length) out.push(`Also known as: ${s.alsoKnownAs.join(', ')}`)
    if (s.summary) out.push('', oneLine(s.summary))
    out.push('')
    if (court) out.push(`- Court: ${court}`)
    if (gb) out.push(`- Governing body: ${gb}`)
    if (s.formats?.length) out.push(`- Formats: ${s.formats.map((f: any) => f.name).join(', ')}`)
    if (isShown(s.origin)) out.push(`- Origin: ${factText(s.origin)}`)
    out.push('')
  }
  out.push('## Governing bodies', '')
  for (const g of [...store.ofType('governingBody')].sort(byImportance)) {
    const sports = store.derefAll(g.sports).map((x) => x.name).join(', ')
    out.push(`- ${bodyLabel(g)}${g.acronym && g.acronym !== g.name && !g.formerNames?.length ? ` (${g.acronym})` : ''}${sports ? ` [${sports}]` : ''}: ${oneLine(g.summary)} ${abs(`/governing-bodies/${g.slug?.current}/`)}`)
  }
  out.push('')
  return out.join('\n')
}
