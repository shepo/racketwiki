/**
 * Court geometry, built from `court` documents. Only verified, sourced
 * measurements are used: if the length or width is unverified there is no diagram.
 */
import type {Doc, Fact} from './content'
import {isShown} from './facts'
import {toMetres, formatMeasurement} from './units.mjs'

export type Line = {x1: number; y1: number; x2: number; y2: number; label?: string}
export type CourtGeometry = {length: number; width: number; hasNet: boolean; lines: Line[]; lengthFact: Fact; widthFact: Fact}

const metres = (f?: Fact | null) => (isShown(f) && f.measurement ? toMetres(f.measurement) : undefined)
const mOf = (m?: {value: number; unit: string}) => (m && typeof m.value === 'number' ? toMetres(m) : undefined)

export function courtGeometry(court?: Doc): CourtGeometry | null {
  if (!court || court.standard === false) return null
  const L = metres(court.length)
  const W = metres(court.width)
  if (!L || !W) return null
  const lines: Line[] = []
  for (const mk of court.markings ?? []) {
    const d = metres(mk.offset)
    if (d == null) continue // unverified line: not drawn
    if (mk.kind === 'across') {
      const inset = mOf(mk.inset) ?? 0
      const xs = mk.from === 'end' ? [d, L - d] : [L / 2 - d, L / 2 + d]
      for (const x of mk.mirror === false ? [xs[0]] : [...new Set(xs)]) lines.push({x1: x, y1: inset, x2: x, y2: W - inset, label: mk.label})
    } else if (mk.kind === 'along') {
      const start = mOf(mk.start) ?? 0
      const end = mOf(mk.end) ?? L / 2
      const ys = d === 0 || mk.mirror === false ? [W / 2 - d] : [W / 2 - d, W / 2 + d]
      for (const y of ys) {
        if (start === 0 && end >= L / 2) lines.push({x1: 0, y1: y, x2: L, y2: y, label: mk.label})
        else {
          lines.push({x1: L / 2 - end, y1: y, x2: L / 2 - start, y2: y, label: mk.label})
          lines.push({x1: L / 2 + start, y1: y, x2: L / 2 + end, y2: y, label: mk.label})
        }
      }
    }
  }
  return {length: L, width: W, hasNet: court.hasNet !== false, lines, lengthFact: court.length, widthFact: court.width}
}

const r = (n: number) => Math.round(n * 10) / 10
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Full court diagram, drawn to scale, labelled in metric and imperial. */
export function courtSvg(g: CourtGeometry, name: string, opts: {width?: number} = {}) {
  const VW = opts.width ?? 700
  const padX = 56
  const padTop = 30
  const padBottom = 44
  const k = (VW - padX * 2) / g.length
  const ch = g.width * k
  const VH = Math.ceil(ch + padTop + padBottom)
  const X = (x: number) => r(padX + x * k)
  const Y = (y: number) => r(padTop + y * k)
  const lenLabel = formatMeasurement(g.lengthFact.measurement!, 'exact')!
  const widLabel = formatMeasurement(g.widthFact.measurement!, 'exact')!
  const parts: string[] = []
  parts.push(`<rect class="cd-surface" x="${X(0)}" y="${Y(0)}" width="${r(g.length * k)}" height="${r(ch)}"/>`)
  for (const l of g.lines) parts.push(`<line class="cd-line" x1="${X(l.x1)}" y1="${Y(l.y1)}" x2="${X(l.x2)}" y2="${Y(l.y2)}"/>`)
  parts.push(`<rect class="cd-outline" x="${X(0)}" y="${Y(0)}" width="${r(g.length * k)}" height="${r(ch)}"/>`)
  if (g.hasNet) {
    parts.push(`<line class="cd-net" x1="${X(g.length / 2)}" y1="${Y(0) - 8}" x2="${X(g.length / 2)}" y2="${Y(g.width) + 8}"/>`)
    parts.push(`<text class="cd-small" x="${X(g.length / 2) + 6}" y="${Y(0) - 12}">Net</text>`)
  }
  const dy = Y(g.width) + 26
  parts.push(`<line class="cd-dim" x1="${X(0)}" y1="${dy - 4}" x2="${X(g.length)}" y2="${dy - 4}"/>`)
  parts.push(`<line class="cd-dim" x1="${X(0)}" y1="${dy - 10}" x2="${X(0)}" y2="${dy + 2}"/>`)
  parts.push(`<line class="cd-dim" x1="${X(g.length)}" y1="${dy - 10}" x2="${X(g.length)}" y2="${dy + 2}"/>`)
  parts.push(`<text class="cd-label" text-anchor="middle" x="${X(g.length / 2)}" y="${dy + 14}">${esc(lenLabel.metric)} (${esc(lenLabel.imperial)})</text>`)
  const wx = X(0) - 16
  parts.push(`<text class="cd-label" text-anchor="middle" transform="translate(${wx} ${Y(g.width / 2)}) rotate(-90)">${esc(widLabel.metric)} (${esc(widLabel.imperial)})</text>`)
  const aria = `${name} drawn to scale: ${lenLabel.metric} long and ${widLabel.metric} wide (${lenLabel.imperial} by ${widLabel.imperial})${g.hasNet ? ', with the net across the middle' : ''}.`
  return `<svg class="court-diagram" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(aria)}">${parts.join('')}</svg>`
}

export type OverlayItem = {name: string; g: CourtGeometry; color: string; dash?: string}

/** Several courts centred on one another at a common scale. */
export function overlaySvg(items: OverlayItem[], opts: {width?: number} = {}) {
  if (!items.length) return ''
  const sorted = [...items].sort((a, b) => b.g.length * b.g.width - a.g.length * a.g.width)
  const maxL = Math.max(...items.map((i) => i.g.length))
  const maxW = Math.max(...items.map((i) => i.g.width))
  const VW = opts.width ?? 560
  const pad = 14
  const k = (VW - pad * 2) / maxL
  const VH = Math.ceil(maxW * k + pad * 2)
  const cx = VW / 2
  const cy = pad + (maxW * k) / 2
  const parts: string[] = []
  sorted.forEach((it) => {
    const w = it.g.length * k
    const h = it.g.width * k
    const x = cx - w / 2
    const y = cy - h / 2
    parts.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" style="fill:none;stroke:${it.color};stroke-width:2.5${it.dash ? `;stroke-dasharray:${it.dash}` : ''}"/>`)
  })
  const desc = sorted.map((i) => `${i.name} ${r(i.g.length)} by ${r(i.g.width)} metres`).join(', ')
  return `<svg class="court-overlay" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Court outlines centred and drawn to one scale: ${esc(desc)}.">${parts.join('')}</svg>`
}
