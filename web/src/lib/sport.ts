import type {Doc, Store} from './content'
import {SPORT_TABS, sportUrl, type SportTabKey} from './routes'
import {courtGeometry} from './court'

/** Everything a sport hub needs, with generated (forward + reverse) cross-links. */
export function sportView(store: Store, sport: Doc) {
  const id = sport._id
  const courts = store.linked(sport.courts, 'court', 'sport', id)
  const ruleSet = store.deref(sport.ruleSet) ?? store.referencing('ruleSet', 'sport', id)[0]
  const equipment = store.linked(sport.equipmentSpecs, 'equipmentSpec', 'sport', id)
  const balls = store.linked(sport.balls, 'ball', 'sport', id)
  const nets = store.linked(sport.nets, 'net', 'sport', id)
  const brands = store.linked(sport.brands, 'brand', 'sports', id)
  const players = store.linked(sport.players, 'player', 'sport', id)
  const competitions = store.linked(sport.competitions, 'competition', 'sports', id)
  const governingBodies = store.linked(sport.governingBodies, 'governingBody', 'sports', id)
  const related = (sport.relatedSports ?? [])
    .map((r: any) => ({...r, doc: store.deref(r.sport)}))
    .filter((r: any) => r.doc)
  const listings = store.referencing('directoryListing', 'sports', id)
  const has: Record<SportTabKey, boolean> = {
    overview: true,
    rules: !!ruleSet,
    equipment: equipment.length + balls.length + nets.length > 0,
    courts: courts.length > 0,
    brands: brands.length > 0,
    players: players.length > 0,
    competitions: competitions.length > 0,
    organisations: governingBodies.length > 0 || !!sport.governingBodyFact,
  }
  const tabs = SPORT_TABS.filter((t) => has[t.key]).map((t) => ({...t, href: sportUrl(sport, t.key)}))
  const mainCourt = courts.find((c) => courtGeometry(c)) ?? courts[0]
  return {sport, courts, mainCourt, ruleSet, equipment, balls, nets, brands, players, competitions, governingBodies, related, listings, has, tabs}
}

export type SportView = ReturnType<typeof sportView>

/** Colour-coded jump links to the other sections of this sport. */
export function jumpsFor(view: SportView, current: SportTabKey) {
  return view.tabs.filter((t) => t.key !== current).map((t) => ({label: `${view.sport.name}: ${t.label.toLowerCase()}`, href: t.href, section: t.section}))
}
