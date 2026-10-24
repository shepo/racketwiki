import type {Fact, Store, Doc} from './content'
import {formatMeasurement} from './units.mjs'

/** A fact is shown publicly only if it is verified, sourced and has a value. */
export function isShown(f?: Fact | null): f is Fact {
  return !!f && !f.unverified && !!f.source?._ref && (f.text != null || !!f.measurement)
}

/** Display text for a fact, or null when it must not be rendered as fact. */
export function factText(f?: Fact | null): string | null {
  if (!isShown(f)) return null
  if (f.measurement) return formatMeasurement(f.measurement, f.qualifier)?.text ?? null
  return f.text ?? null
}

export function factParts(f?: Fact | null) {
  if (!isShown(f) || !f.measurement) return null
  return formatMeasurement(f.measurement, f.qualifier)
}

export function factSource(store: Store, f?: Fact | null): Doc | undefined {
  return isShown(f) ? store.deref(f.source) : undefined
}

/** Collect every distinct source cited by the shown facts in a value tree. */
export function collectSources(store: Store, ...nodes: unknown[]): Doc[] {
  const ids = new Set<string>()
  const visit = (n: any) => {
    if (Array.isArray(n)) return n.forEach(visit)
    if (n && typeof n === 'object') {
      if (n._type === 'sourcedFact' && isShown(n)) ids.add(n.source._ref)
      for (const v of Object.values(n)) if (v && typeof v === 'object') visit(v)
    }
  }
  nodes.forEach(visit)
  return [...ids].map((id) => store.get(id)).filter(Boolean).sort((a, b) => (a!.tier ?? 9) - (b!.tier ?? 9) || String(a!.name).localeCompare(String(b!.name))) as Doc[]
}

export function latestVerified(...nodes: unknown[]): string | undefined {
  let latest: string | undefined
  const visit = (n: any) => {
    if (Array.isArray(n)) return n.forEach(visit)
    if (n && typeof n === 'object') {
      if (n._type === 'sourcedFact' && isShown(n) && n.verifiedOn && (!latest || n.verifiedOn > latest)) latest = n.verifiedOn
      for (const v of Object.values(n)) if (v && typeof v === 'object') visit(v)
    }
  }
  nodes.forEach(visit)
  return latest
}

export function countUnverified(...nodes: unknown[]): number {
  let c = 0
  const visit = (n: any) => {
    if (Array.isArray(n)) return n.forEach(visit)
    if (n && typeof n === 'object') {
      if (n._type === 'sourcedFact' && !isShown(n)) c++
      for (const v of Object.values(n)) if (v && typeof v === 'object') visit(v)
    }
  }
  nodes.forEach(visit)
  return c
}

export const formatDate = (iso?: string) =>
  iso ? new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : '')).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}) : ''

/** Domain shown only for researched sources/links. */
export function publicDomain(link?: {url?: string; status?: string} | null) {
  if (!link?.url || link.status !== 'researched') return null
  try {
    return new URL(link.url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function spec(rows: any[] | undefined, key: string) {
  return rows?.find((r) => r.key === key)?.fact as Fact | undefined
}
