#!/usr/bin/env node
// Validates seed/*.ndjson: JSON, unique ids, references resolve, every published
// sourcedFact has a source/tier/date (or is marked unverified), units are metric,
// array members have _key, and every document has slug + section.
import {readdirSync, readFileSync} from 'node:fs'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'seed')
const UNITS = new Set(['mm', 'cm', 'm', 'g', 'kg'])
const SECTIONS = new Set(['sports', 'rules', 'equipment', 'courts', 'brands', 'players', 'competitions', 'governing-bodies', 'directory', 'sources'])
const NO_SLUG = new Set(['sponsorPlacement', 'correction'])

export function loadSeed(dir = root) {
  const docs = []
  const errors = []
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.ndjson')).sort()) {
    readFileSync(join(dir, file), 'utf8').split('\n').forEach((line, i) => {
      if (!line.trim()) return
      try {
        docs.push({doc: JSON.parse(line), where: `${file}:${i + 1}`})
      } catch (e) {
        errors.push(`${file}:${i + 1} invalid JSON: ${e.message}`)
      }
    })
  }
  return {docs, errors}
}

export function validate({docs, errors}) {
  const warnings = []
  const ids = new Map()
  for (const {doc, where} of docs) {
    if (!doc._id || !doc._type) errors.push(`${where} missing _id or _type`)
    if (ids.has(doc._id)) errors.push(`${where} duplicate _id ${doc._id} (first at ${ids.get(doc._id)})`)
    ids.set(doc._id, where)
  }
  const stats = {facts: 0, unverified: 0}
  for (const {doc, where} of docs) {
    const at = `${where} ${doc._id}`
    if (!NO_SLUG.has(doc._type)) {
      if (!doc.slug?.current) errors.push(`${at} missing slug.current`)
      if (!SECTIONS.has(doc.section)) errors.push(`${at} missing or bad section "${doc.section}"`)
    }
    if (doc._type === 'source') {
      if (![1, 2, 3, 4, 5].includes(doc.tier)) errors.push(`${at} source tier must be 1-5`)
      if (!['researched', 'verify'].includes(doc.status)) errors.push(`${at} source status must be researched|verify`)
      if (doc.status === 'researched' && !doc.url) warnings.push(`${at} researched source has no url`)
    }
    walk(doc, '', (node, path, parentIsArray) => {
      if (parentIsArray && node && typeof node === 'object' && !node._key) errors.push(`${at} ${path} array member missing _key`)
      if (node?._type === 'reference' && !ids.has(node._ref)) errors.push(`${at} ${path} dangling reference -> ${node._ref}`)
      if (node?._type === 'measurement') {
        if (!UNITS.has(node.unit)) errors.push(`${at} ${path} unit "${node.unit}" is not metric (mm, cm, m, g, kg)`)
        if (typeof node.value !== 'number') errors.push(`${at} ${path} measurement value must be a number`)
      }
      if (node?._type === 'sourcedFact') {
        stats.facts++
        if (node.unverified) {
          stats.unverified++
          return
        }
        if (node.text == null && !node.measurement) errors.push(`${at} ${path} fact has no value (mark unverified)`)
        if (!node.source?._ref) errors.push(`${at} ${path} fact has no source and is not marked unverified`)
        if (![1, 2, 3, 4, 5].includes(node.tier)) errors.push(`${at} ${path} fact missing tier`)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(node.verifiedOn ?? '')) errors.push(`${at} ${path} fact missing verifiedOn (YYYY-MM-DD)`)
        const src = docs.find((d) => d.doc._id === node.source?._ref)?.doc
        if (src && node.tier && src.tier && node.tier !== src.tier) warnings.push(`${at} ${path} fact tier ${node.tier} differs from source tier ${src.tier}`)
      }
    })
  }
  return {errors, warnings, stats, count: docs.length}
}

function walk(node, path, visit, parentIsArray = false) {
  if (Array.isArray(node)) {
    node.forEach((n, i) => walk(n, `${path}[${i}]`, visit, true))
    return
  }
  if (node && typeof node === 'object') {
    visit(node, path, parentIsArray)
    for (const [k, v] of Object.entries(node)) if (v && typeof v === 'object') walk(v, path ? `${path}.${k}` : k, visit)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validate(loadSeed(process.argv[2] ?? root))
  for (const w of result.warnings) console.warn('warn ', w)
  for (const e of result.errors) console.error('error', e)
  const byType = {}
  console.log(`\n${result.count} documents, ${result.stats.facts} sourced facts (${result.stats.unverified} unverified), ${result.errors.length} errors, ${result.warnings.length} warnings`)
  process.exit(result.errors.length ? 1 : 0)
}
