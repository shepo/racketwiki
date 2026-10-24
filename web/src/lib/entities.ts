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
    title: 'Racket sport players', lead: 'Leading players across racket sports, with rankings dated and sourced to the body that publishes them.',
    facts: (d) => [row('Nationality', d.nationality), row('Born', d.born), row('Plays', d.plays), row('Ranking', d.ranking), ...(d.highlights ?? []).map((h: any) => row('Highlight', h))],
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
  'governing-bodies': {
    type: 'governingBody', section: 'governing-bodies', route: 'governing-bodies', label: 'Governing body', plural: 'Governing bodies',
    title: 'Racket sport governing bodies', lead: 'The international federations and national associations that write the rules of each racket sport.',
    facts: (d) => [row('Founded', d.founded), row('Headquarters', d.headquarters), row('Members', d.members)],
    sportsOf: (d, s) => s.derefAll(d.sports),
    jsonLd: (d, s) => ({
      '@context': 'https://schema.org', '@type': 'SportsOrganization', name: d.name, ...(d.acronym ? {alternateName: d.acronym} : {}),
      url: abs(urlFor(s, d)!), ...(publicDomain(d.website) ? {sameAs: [d.website.url]} : {}),
      ...(s.derefAll(d.sports).length ? {sport: s.derefAll(d.sports).map((x) => x.name)} : {}),
      ...(isShown(d.founded) && d.founded.text ? {foundingDate: d.founded.text} : {}),
    }),
  },
}

export const shortText = (d: Doc) => d.summary ?? factText(d.country) ?? ''
