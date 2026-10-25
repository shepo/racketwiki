import type {Doc, Store} from './content'
import {slugOf} from './content'

export const SPORT_TABS = [
  {key: 'overview', label: 'Overview', path: '', section: 'sports'},
  {key: 'rules', label: 'Rules', path: 'rules/', section: 'rules'},
  {key: 'equipment', label: 'Equipment', path: 'equipment/', section: 'equipment'},
  {key: 'courts', label: 'Courts', path: 'courts/', section: 'courts'},
  {key: 'brands', label: 'Brands', path: 'brands/', section: 'brands'},
  {key: 'players', label: 'Players', path: 'players/', section: 'players'},
  {key: 'competitions', label: 'Competitions', path: 'competitions/', section: 'competitions'},
  {key: 'organisations', label: 'Organisations', path: 'organisations/', section: 'governing-bodies'},
] as const

export type SportTabKey = (typeof SPORT_TABS)[number]['key']

export const sportUrl = (sport: Doc, tab: SportTabKey = 'overview') =>
  `/sports/${slugOf(sport)}/${SPORT_TABS.find((t) => t.key === tab)!.path}`

/** Canonical URL for any document. */
export function urlFor(store: Store, doc?: Doc): string | undefined {
  if (!doc) return undefined
  const s = slugOf(doc)
  const sportOf = () => store.deref(doc.sport)
  switch (doc._type) {
    case 'sport':
      return `/sports/${s}/`
    case 'court': {
      const sp = sportOf()
      return sp ? sportUrl(sp, 'courts') : '/courts/'
    }
    case 'ruleSet': {
      const sp = sportOf()
      return sp ? sportUrl(sp, 'rules') : '/rules/'
    }
    case 'equipmentSpec':
    case 'ball':
    case 'net': {
      const sp = sportOf()
      return sp ? sportUrl(sp, 'equipment') : '/equipment/'
    }
    case 'venue':
      return `/venues/${s}/`
    case 'brand':
      return `/brands/${s}/`
    case 'player':
      return `/players/${s}/`
    case 'competition':
      return `/competitions/${s}/`
    case 'governingBody':
      return `/governing-bodies/${s}/`
    case 'directoryListing':
      return `/directory/${doc.listingType}/#${s}`
    case 'source':
      return `/sources/#${s}`
    case 'page':
      return doc.kind === 'guide' ? `/guides/${s}/` : `/${s}/`
    case 'story':
      return doc.path ?? urlFor(store, store.deref(doc.link))
  }
  return undefined
}
