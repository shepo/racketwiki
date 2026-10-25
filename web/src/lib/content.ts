/**
 * Content loader. Reads published documents from Sanity when SANITY_PROJECT_ID
 * is set, otherwise from the repo's seed/*.ndjson files, so the site always builds.
 * Everything is loaded once per build and resolved in memory.
 */
import {SITE} from '../site.config'
import {readdirSync, readFileSync, existsSync} from 'node:fs'
import {join, resolve} from 'node:path'

export type Ref = {_type: 'reference'; _ref: string}
export type Measurement = {value: number; valueTo?: number; unit: string}
export type Fact = {
  _type?: 'sourcedFact'
  text?: string
  measurement?: Measurement
  qualifier?: 'exact' | 'max' | 'min' | 'range' | 'approx'
  source?: Ref
  citation?: string
  tier?: number
  verifiedOn?: string
  unverified?: boolean
  editorNote?: string
}
export type Doc = {_id: string; _type: string; slug?: {current: string}; section?: string; name?: string; title?: string; [k: string]: any}

const HIDDEN_TYPES = new Set(['correction'])

let store: Promise<Store> | undefined

export class Store {
  byId = new Map<string, Doc>()
  constructor(docs: Doc[]) {
    for (const d of docs) if (!HIDDEN_TYPES.has(d._type) && !d._id.startsWith('drafts.')) this.byId.set(d._id, d)
  }
  get(id?: string) {
    return id ? this.byId.get(id) : undefined
  }
  deref<T extends Doc = Doc>(ref?: Ref | null): T | undefined {
    return ref?._ref ? (this.byId.get(ref._ref) as T | undefined) : undefined
  }
  derefAll<T extends Doc = Doc>(refs?: Ref[] | null): T[] {
    return (refs ?? []).map((r) => this.deref<T>(r)).filter(Boolean) as T[]
  }
  ofType<T extends Doc = Doc>(type: string): T[] {
    return [...this.byId.values()]
      .filter((d) => d._type === type)
      .sort((a, b) => (a.name ?? a.title ?? '').localeCompare(b.name ?? b.title ?? '')) as T[]
  }
  /** Documents of `type` whose field (a ref or array of refs) points at `id`. Generates cross-links. */
  referencing<T extends Doc = Doc>(type: string, field: string, id: string): T[] {
    return this.ofType<T>(type).filter((d) => {
      const v = d[field]
      if (Array.isArray(v)) return v.some((r: Ref) => r?._ref === id)
      return v?._ref === id
    })
  }
  /** Union of forward refs and reverse refs, de-duplicated. */
  linked<T extends Doc = Doc>(forward: Ref[] | undefined, type: string, field: string, id: string): T[] {
    const seen = new Map<string, T>()
    for (const d of [...this.derefAll<T>(forward), ...this.referencing<T>(type, field, id)]) if (d._type === type) seen.set(d._id, d)
    return [...seen.values()].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
  }
}

function readSeed(): Doc[] {
  const dir = [resolve('seed'), resolve('..', 'seed')].find((d) => existsSync(d))
  if (!dir) return []
  const docs: Doc[] = []
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ndjson')).sort()) {
    for (const line of readFileSync(join(dir, f), 'utf8').split('\n')) {
      if (line.trim()) docs.push(JSON.parse(line))
    }
  }
  return docs
}

async function readSanity(): Promise<Doc[]> {
  const {createClient} = await import('@sanity/client')
  const client = createClient({
    projectId: SITE.sanityProjectId,
    dataset: SITE.sanityDataset,
    apiVersion: '2025-10-01',
    useCdn: false,
    perspective: 'published',
  })
  return client.fetch('*[!(_id in path("drafts.**")) && !(_type match "system.*") && !(_type match "sanity.*")]')
}

export function getStore(): Promise<Store> {
  store ??= (SITE.sanityProjectId ? readSanity() : Promise.resolve(readSeed())).then((docs) => new Store(docs))
  return store
}

export const slugOf = (d?: Doc) => d?.slug?.current ?? ''
export const nameOf = (d?: Doc) => d?.name ?? d?.title ?? ''

/** Most important first (editorial 1–5 rating), then alphabetical. */
export const byImportance = (a: Doc, b: Doc) => (b.importance ?? 0) - (a.importance ?? 0) || nameOf(a).localeCompare(nameOf(b))
