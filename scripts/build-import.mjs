#!/usr/bin/env node
// Concatenates seed/*.ndjson into seed/dist/import.ndjson for `sanity dataset import`,
// after validation. Refuses to write if the seed has errors.
import {mkdirSync, writeFileSync} from 'node:fs'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {loadSeed, validate} from './validate-seed.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'seed')
const loaded = loadSeed(root)
const result = validate(loaded)
if (result.errors.length) {
  for (const e of result.errors) console.error('error', e)
  console.error(`\n${result.errors.length} errors: fix the seed before importing.`)
  process.exit(1)
}
mkdirSync(join(root, 'dist'), {recursive: true})
writeFileSync(join(root, 'dist', 'import.ndjson'), loaded.docs.map((d) => JSON.stringify(d.doc)).join('\n') + '\n')
console.log(`Wrote seed/dist/import.ndjson (${loaded.docs.length} documents)`)
