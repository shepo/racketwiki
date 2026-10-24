#!/usr/bin/env node
// Prepares seed documents for import as Sanity drafts: references become weak with
// _strengthenOnPublish, as Studio does for references to unpublished documents, so
// drafts can point at each other. Writes seed/dist/drafts-<n>.json batches (<90 KB each).
import {mkdirSync, writeFileSync} from 'node:fs'
import {loadSeed, validate} from './validate-seed.mjs'

const loaded = loadSeed()
const res = validate(loaded)
if (res.errors.length) { console.error(res.errors.join('\n')); process.exit(1) }
const typeOf = new Map(loaded.docs.map(({doc}) => [doc._id, doc._type]))
const fix = (n) => {
  if (Array.isArray(n)) return n.map(fix)
  if (n && typeof n === 'object') {
    if (n._type === 'reference') return {...n, _weak: true, _strengthenOnPublish: {type: typeOf.get(n._ref)}}
    return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, fix(v)]))
  }
  return n
}
const docs = loaded.docs.map(({doc}) => fix(doc))
mkdirSync('seed/dist', {recursive: true})
const batches = [[]]
let size = 0
for (const d of docs) {
  const s = JSON.stringify(d).length
  if (size + s > 45000) { batches.push([]); size = 0 }
  batches.at(-1).push({type: d._type, content: d})
  size += s
}
batches.forEach((b, i) => writeFileSync(`seed/dist/drafts-${i + 1}.json`, JSON.stringify(b)))
console.log(`${docs.length} documents in ${batches.length} batches`, batches.map((b) => b.length))
