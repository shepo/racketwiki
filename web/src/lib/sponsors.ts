import type {Doc, Store} from './content'

export type SponsorContext = {path: string; section?: string; sportId?: string}

const RANK = {page: 4, sport: 3, section: 2, site: 1} as const

/** Pick the most specific active placement for this page. Placements are data in Sanity. */
export function pickPlacement(store: Store, placement: 'strip' | 'card', ctx: SponsorContext, now = new Date()): Doc | undefined {
  const active = store.ofType('sponsorPlacement').filter((p) => {
    if (p.placement !== placement) return false
    if (p.start && new Date(p.start) > now) return false
    if (p.end && new Date(p.end) < now) return false
    switch (p.scope) {
      case 'site':
        return true
      case 'section':
        return !!ctx.section && p.section === ctx.section
      case 'sport':
        return !!ctx.sportId && p.sport?._ref === ctx.sportId
      case 'page':
        return p.pagePath === ctx.path
    }
    return false
  })
  return active.sort((a, b) => (RANK[b.scope as keyof typeof RANK] ?? 0) - (RANK[a.scope as keyof typeof RANK] ?? 0))[0]
}
