import type {Doc, Store} from './content'
import {factText, isShown, publicDomain} from './facts'
import {abs} from './seo'
import {urlFor} from './routes'
import type {SectionKey} from './sections'

export type EntityDef = {
  type: string
  section: SectionKey
  route: string
  label: string
  plural: string
  title: string
  lead: string
  facts: (d: Doc, s: Store) => {label: string; fact: any}[]
  sportsOf: (d: Doc, s: Store) => Doc[]
  jsonLd?: (d: Doc, s: Store) => unknown
}

const row = (label: string, fact: any) => ({label, fact})

export const ENTITIES: Record<string, EntityDef> = {
  brands: {
    type: 'brand', section: 'brands', route: 'brands', label: 'Brand', plural: 'Brands',
    title: 'Racket sport brands', lead: 'Makers of rackets, paddles, bats, balls and nets, with what they make and where they are based.',
    facts: (d) => [row('Based in', d.country), row('Founded', d.founded), row('Parent company', d.parentCompany), ...(d.products ?? []).map((p: any) => row(p.category ?? 'Products', p.fact))],
    sportsOf: (d, s) => s.derefAll(d.sports),
    jsonLd: (d, s) => ({'@context': 'https://schema.org', '@type': 'Brand', name: d.name, url: abs(urlFor(s, d)!), ...(publicDomain(d.website) ? {sameAs: [d.website.url]} : {})}),
  },
  players: {
    type: 'player', section: 'players', route: 'players', label: 'Player', plural: 'Players',
    title: 'Racket sport players', lead: 'Leading players across racket sports and the honours they have won. We do not publish rankings; follow the tours for those.',
    facts: (d) => [row('Nationality', d.nationality), row('Born', d.born), row('Plays', d.plays), ...(d.highlights ?? []).map((h: any) => row('Honour', h))],
    sportsOf: (d, s) => s.derefAll(d.sport ? [d.sport] : []),
    jsonLd: (d, s) => ({
      '@context': 'https://schema.org', '@type': 'Person', name: d.name, url: abs(urlFor(s, d)!),
      ...(isShown(d.nationality) && d.nationality.text ? {nationality: d.nationality.text} : {}),
      ...(isShown(d.born) && /^\d{4}-\d{2}-\d{2}$/.test(d.born.text ?? '') ? {birthDate: d.born.text} : {}),
      ...(s.deref(d.sport) ? {knowsAbout: s.deref(d.sport)!.name} : {}),
    }),
  },
  competitions: {
    type: 'competition', section: 'competitions', route: 'competitions', label: 'Competition', plural: 'Competitions',
    title: 'Racket sport competitions and tours', lead: 'Professional tours, world championships and major events across racket sports, and who runs them.',
    facts: (d) => [row('Organiser', d.organiserFact), row('First held', d.founded), row('Format', d.format), row('How often', d.frequency), row('Venue', d.venue)],
    sportsOf: (d, s) => s.derefAll(d.sports),
    jsonLd: (d, s) => ({'@context': 'https://schema.org', '@type': d.isTour ? 'SportsOrganization' : 'SportsEvent', name: d.name, url: abs(urlFor(s, d)!), ...(s.derefAll(d.sports)[0] ? {sport: s.derefAll(d.sports)[0].name} : {})}),
  },
  venues: {
    type: 'venue', section: 'courts', route: 'venues', label: 'Venue', plural: 'Famous venues',
    title: 'Famous racket sport venues', lead: 'The stadiums, clubs and courts where racket sports\u2019 biggest events are played.',
    facts: (d) => [row('City', d.city), row('Country', d.country), row('Opened', d.opened), row('Capacity', d.capacity), row('Surface', d.surface)],
    sportsOf: (d, s) => s.derefAll(d.sports),
    jsonLd: (d, s) => ({
      '@context': 'https://schema.org', '@type': 'StadiumOrArena', name: d.name, url: abs(urlFor(s, d)!),
      ...(isShown(d.city) && isShown(d.country) && d.city.text && d.country.text ? {address: {'@type': 'PostalAddress', addressLocality: d.city.text, addressCountry: d.country.text}} : {}),
      ...(publicDomain(d.website) ? {sameAs: [d.website.url]} : {}),
    }),
  },
  'governing-bodies': {
    type: 'governingBody', section: 'governing-bodies', route: 'governing-bodies', label: 'Governing body', plural: 'Governing bodies',
    title: 'Racket sport governing bodies', lead: 'The international federations and national associations that write the rules of each racket sport.',
    facts: (d) => [row('Name', d.nameChange), row('Founded', d.founded), row('Headquarters', d.headquarters), row('Members', d.members)],
    sportsOf: (d, s) => s.derefAll(d.sports),
    jsonLd: (d, s) => ({
      '@context': 'https://schema.org', '@type': 'SportsOrganization', name: d.name, ...(d.acronym || d.formerNames?.length ? {alternateName: [d.acronym !== d.name ? d.acronym : null, ...(d.formerNames ?? [])].filter(Boolean)} : {}),
      url: abs(urlFor(s, d)!), ...(publicDomain(d.website) ? {sameAs: [d.website.url]} : {}),
      ...(s.derefAll(d.sports).length ? {sport: s.derefAll(d.sports).map((x) => x.name)} : {}),
      ...(isShown(d.founded) && d.founded.text ? {foundingDate: d.founded.text} : {}),
    }),
  },
}

export const shortText = (d: Doc) => d.summary ?? factText(d.country) ?? ''

/** "World Tennis (formerly the International Tennis Federation)" — cross-refers renamed bodies. */
export const bodyLabel = (d?: Doc) => (d ? (d.formerNames?.length ? `${d.name} (formerly the ${d.formerNames[0]})` : d.name) : '')

/** Governing-body levels in display order, used to group long lists of bodies. */
export const BODY_SCOPES = [
  {key: 'international', label: 'World governing body'},
  {key: 'tour', label: 'Professional tours'},
  {key: 'continental', label: 'Continental associations'},
  {key: 'national', label: 'National federations'},
  {key: 'coaching', label: 'Coaching and qualification bodies'},
  {key: 'association', label: 'Other associations'},
] as const

/** Regions that continental and national bodies are listed under. */
export const BODY_REGIONS = [
  {key: 'africa', label: 'Africa'},
  {key: 'americas', label: 'Americas'},
  {key: 'asia', label: 'Asia'},
  {key: 'europe', label: 'Europe'},
  {key: 'oceania', label: 'Oceania'},
] as const

/**
 * Groups bodies for display: world body, tours, then one group per region (its continental
 * association first, then the national federations), then coaching bodies and other
 * associations. Continental or national bodies with no region fall into "Other national
 * federations". Order within a group is kept, so sort before calling. Empty groups are dropped.
 */
export function groupByScope<T extends {scope?: string; region?: string}>(docs: T[]) {
  const known = new Set(BODY_SCOPES.map((x) => x.key as string))
  const scopeOf = (d: T) => (known.has(d.scope ?? '') ? d.scope! : 'association')
  const regional = (d: T) => scopeOf(d) === 'continental' || scopeOf(d) === 'national'
  const regionKeys = new Set(BODY_REGIONS.map((r) => r.key as string))
  const byScope = (key: string) => docs.filter((d) => scopeOf(d) === key)
  const continentalFirst = (items: T[]) => [...items.filter((d) => scopeOf(d) === 'continental'), ...items.filter((d) => scopeOf(d) === 'national')]
  return [
    {key: 'international', label: 'World governing body', items: byScope('international')},
    {key: 'tour', label: 'Professional tours', items: byScope('tour')},
    ...BODY_REGIONS.map((r) => ({key: r.key as string, label: r.label as string, items: continentalFirst(docs.filter((d) => regional(d) && d.region === r.key))})),
    {key: 'unplaced', label: 'Other national federations', items: continentalFirst(docs.filter((d) => regional(d) && !regionKeys.has(d.region ?? '')))},
    {key: 'coaching', label: 'Coaching and qualification bodies', items: byScope('coaching')},
    {key: 'association', label: 'Other associations', items: byScope('association')},
  ].filter((g) => g.items.length > 0)
}
