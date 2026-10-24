#!/usr/bin/env node
/**
 * Sync seed/*.ndjson into the Sanity dataset as PUBLISHED documents, in one transaction.
 *
 *   node scripts/sync-sanity.mjs                 # create-missing: add seed docs that are not in Sanity yet (safe default)
 *   node scripts/sync-sanity.mjs --mode=replace  # overwrite every seed doc and discard its draft (first switch-over only)
 *   node scripts/sync-sanity.mjs --dry-run       # print what would change, write nothing
 *
 * Needs SANITY_AUTH_TOKEN (a token with write access). Runs from .github/workflows/sanity-sync.yml.
 * Once editors work in the Studio, Sanity is the source of truth: only use --mode=replace with care,
 * because it overwrites edits made in the Studio to any document that is also in the seed.
 */
import fs from 'node:fs'
import path from 'node:path'

const PROJECT = process.env.SANITY_PROJECT_ID || 'gojst4dq'
const DATASET = process.env.SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN
const args = process.argv.slice(2)
const mode = (args.find((a) => a.startsWith('--mode=')) ?? '--mode=create-missing').split('=')[1]
const dryRun = args.includes('--dry-run')
if (!['create-missing', 'replace'].includes(mode)) throw new Error(`Unknown mode ${mode}`)

const seedDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'seed')
const docs = fs.readdirSync(seedDir).filter((f) => f.endsWith('.ndjson')).sort()
  .flatMap((f) => fs.readFileSync(path.join(seedDir, f), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)))
const ids = new Set()
for (const d of docs) {
  if (!d._id || !d._type) throw new Error(`Seed document without _id/_type: ${JSON.stringify(d).slice(0, 120)}`)
  if (d._id.startsWith('drafts.')) throw new Error(`Seed must not contain drafts: ${d._id}`)
  if (ids.has(d._id)) throw new Error(`Duplicate _id in seed: ${d._id}`)
  ids.add(d._id)
}

const mutations = mode === 'replace'
  ? [...docs.map((d) => ({createOrReplace: d})), ...docs.map((d) => ({delete: {id: `drafts.${d._id}`}}))]
  : docs.map((d) => ({createIfNotExists: d}))

console.log(`${docs.length} seed documents, mode ${mode}${dryRun ? ' (dry run)' : ''}`)
if (dryRun) process.exit(0)
if (!TOKEN) throw new Error('SANITY_AUTH_TOKEN is not set')

const res = await fetch(`https://${PROJECT}.api.sanity.io/v2025-10-01/data/mutate/${DATASET}?returnIds=true&visibility=sync`, {
  method: 'POST',
  headers: {'content-type': 'application/json', authorization: `Bearer ${TOKEN}`},
  body: JSON.stringify({mutations}),
})
const body = await res.json().catch(() => ({}))
if (!res.ok) {
  console.error(`Sanity refused the transaction (${res.status}):`, JSON.stringify(body).slice(0, 2000))
  if (res.status === 401 || res.status === 403) console.error('The token needs write access (Editor), not just Deploy Studio.')
  process.exit(1)
}
const ops = (body.results ?? []).reduce((acc, r) => ((acc[r.operation] = (acc[r.operation] ?? 0) + 1), acc), {})
console.log('Done:', JSON.stringify(ops))
