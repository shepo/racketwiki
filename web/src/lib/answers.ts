import type {Store} from './content'
import {factText, isShown} from './facts'
import {formatDimensions} from './units.mjs'
import {sportView} from './sport'
import {urlFor} from './routes'
import {bodyLabel} from './entities'

/**
 * Quick answers for site search: the sourced figures for "<sport> <item>" questions
 * ("what size is a squash ball", "padel court dimensions"). Built from shown facts only,
 * served as /answers.json and matched in the browser by the search page.
 */
export type Answer = {kind: 'court' | 'ball' | 'net' | 'racket' | 'body'; title: string; url: string; rows: {label: string; text: string}[]}
export type SportAnswers = {name: string; names: string[]; answers: Answer[]}

export function buildAnswers(store: Store): SportAnswers[] {
  return store.ofType('sport').map((sport) => {
    const v = sportView(store, sport)
    const answers: Answer[] = []
    const specRows = (doc: any) => (doc.specs ?? []).filter((r: any) => isShown(r.fact)).map((r: any) => ({label: r.label, text: factText(r.fact)!}))
    const c = v.mainCourt
    if (c && isShown(c.length) && isShown(c.width)) {
      answers.push({kind: 'court', title: `${sport.name} court`, url: urlFor(store, c)!, rows: [{label: 'Size', text: formatDimensions(c.length.measurement, c.width.measurement)!.text}]})
    }
    for (const b of v.balls) { const rows = specRows(b); if (rows.length) answers.push({kind: 'ball', title: b.name, url: urlFor(store, b)!, rows}) }
    for (const n of v.nets) { const rows = specRows(n); if (rows.length) answers.push({kind: 'net', title: n.name, url: urlFor(store, n)!, rows}) }
    for (const e of v.equipment) {
      const rows = specRows(e)
      if (rows.length && ['racket', 'paddle', 'bat'].includes(e.item)) answers.push({kind: 'racket', title: e.name, url: urlFor(store, e)!, rows})
    }
    const world = v.governingBodies.filter((g) => g.scope === 'international')
    if (world.length) answers.push({kind: 'body', title: `Who governs ${sport.name.toLowerCase()}`, url: urlFor(store, world[0])!, rows: world.map((g) => ({label: 'Governing body', text: bodyLabel(g)}))})
    const names = [sport.name, ...(sport.alsoKnownAs ?? []), ...(sport.formerNames ?? [])].map((n: string) => n.toLowerCase())
    return {name: sport.name, names, answers}
  }).filter((s) => s.answers.length)
}
