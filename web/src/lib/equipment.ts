import type {Doc, Store} from './content'
import {spec} from './facts'

export const EQUIPMENT_KINDS = {
  rackets: {
    type: 'equipmentSpec',
    title: 'Racket, paddle and bat limits',
    h1: 'What the rulebooks let you swing',
    lead: 'The maximum size of a racket, paddle or bat in each sport, from the official rules, in metric and imperial.',
    columns: [
      {key: 'length', label: 'Length'},
      {key: 'width', label: 'Width'},
      {key: 'weight', label: 'Weight'},
    ],
  },
  balls: {
    type: 'ball',
    title: 'Balls and shuttles compared',
    h1: 'Balls and shuttles, sport by sport',
    lead: 'The official size and weight of the ball or shuttle in each racket sport, in metric and imperial.',
    columns: [
      {key: 'diameter', label: 'Diameter'},
      {key: 'weight', label: 'Weight'},
    ],
  },
  nets: {
    type: 'net',
    title: 'Net heights compared',
    h1: 'How high is the net?',
    lead: 'The official net height at the centre and at the posts for each racket sport, in metric and imperial.',
    columns: [
      {key: 'heightCentre', label: 'Height at the centre'},
      {key: 'heightPosts', label: 'Height at the posts'},
    ],
  },
} as const

export type EquipmentKind = keyof typeof EQUIPMENT_KINDS

export function equipmentRows(store: Store, kind: EquipmentKind) {
  const def = EQUIPMENT_KINDS[kind]
  return store
    .ofType(def.type)
    .map((doc) => ({doc, sport: store.deref(doc.sport) as Doc | undefined, cells: def.columns.map((c) => spec(doc.specs, c.key))}))
    .filter((r) => r.sport)
    .sort((a, b) => a.sport!.name.localeCompare(b.sport!.name))
}
