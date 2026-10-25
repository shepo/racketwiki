#!/usr/bin/env node
// Post-build checks on web/dist: broken internal links, orphan pages, unique titles
// and descriptions, valid JSON-LD, and that no unverified fact value is rendered.
import {readdirSync, readFileSync, statSync, existsSync} from 'node:fs'
import {join, relative} from 'node:path'
import {loadSeed} from './validate-seed.mjs'
import {formatMeasurement} from '../web/src/lib/units.mjs'

const dist = join(process.cwd(), 'web', 'dist')
const pages = []
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) { if (!['_astro', 'pagefind'].includes(f)) walk(p) }
    else if (f.endsWith('.html')) pages.push(p)
  }
}
walk(dist)
const urlOf = (p) => '/' + relative(dist, p).replace(/index\.html$/, '').replace(/\.html$/, '/')
const problems = []
const titles = new Map()
const descs = new Map()
const inbound = new Map(pages.map((p) => [urlOf(p), 0]))
const html = new Map(pages.map((p) => [urlOf(p), readFileSync(p, 'utf8')]))

for (const [url, src] of html) {
  const noindex = /name="robots" content="noindex"/.test(src)
  const title = src.match(/<title>([^<]*)<\/title>/)?.[1]
  const desc = src.match(/<meta name="description" content="([^"]*)"/)?.[1]
  if (!title) problems.push(`${url} has no <title>`)
  if (!desc) problems.push(`${url} has no meta description`)
  if (!noindex && url !== '/404/') {
    if (titles.has(title)) problems.push(`${url} duplicate title with ${titles.get(title)}`)
    titles.set(title, url)
    if (descs.has(desc)) problems.push(`${url} duplicate description with ${descs.get(desc)}`)
    descs.set(desc, url)
  }
  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]) } catch (e) { problems.push(`${url} invalid JSON-LD: ${e.message}`) }
  }
  if (!/BreadcrumbList/.test(src) && !['/', '/search/', '/404/'].includes(url)) problems.push(`${url} has no BreadcrumbList`)
  for (const m of src.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = m[1].endsWith('/') || /\.\w+$/.test(m[1]) ? m[1] : m[1] + '/'
    if (/\.\w+$/.test(target)) { if (!existsSync(join(dist, target))) problems.push(`${url} links to missing file ${target}`); continue }
    if (!inbound.has(target)) problems.push(`${url} broken link -> ${target}`)
    else if (target !== url) inbound.set(target, inbound.get(target) + 1)
  }
  for (const m of src.matchAll(/rel="([^"]*)"[^>]*>|href="https?:\/\/[^"]*rallio[^"]*"(?![^>]*sponsored)/g)) {
    if (m[0].startsWith('href')) problems.push(`${url} Rallio link without rel="sponsored"`)
  }
}
for (const [url, n] of inbound) if (n === 0 && !['/', '/404/', '/search/'].includes(url)) problems.push(`${url} is an orphan (no internal links point to it)`)

// Unverified values must not appear in rendered fact cells.
// Read the same source the site was built from: Sanity (published) unless SANITY_PROJECT_ID is set to empty.
const project = (process.env.SANITY_PROJECT_ID ?? 'gojst4dq').trim()
const docs = project
  ? await (await import('@sanity/client')).createClient({projectId: project, dataset: process.env.SANITY_DATASET || 'production', apiVersion: '2025-10-01', useCdn: false, perspective: 'published'}).fetch('*[!(_id in path("drafts.**"))]').then((ds) => ds.map((doc) => ({doc})))
  : loadSeed(join(process.cwd(), 'seed')).docs
console.log(`Checking unverified facts from ${project ? `Sanity (${docs.length} documents)` : 'seed'}`)
const unverified = []
const verifiedTexts = new Set()
const textOf = (n) => (n.measurement ? formatMeasurement(n.measurement, n.qualifier)?.text : n.text)
const visit = (n, id) => {
  if (Array.isArray(n)) return n.forEach((x) => visit(x, id))
  if (n && typeof n === 'object') {
    if (n._type === 'sourcedFact' && !n.unverified && textOf(n)) verifiedTexts.add(textOf(n))
    if (n._type === 'sourcedFact' && n.unverified) {
      if (n.measurement) unverified.push({id, text: textOf(n)})
      else if (n.text && n.text.length > 12) unverified.push({id, text: n.text})
    }
    for (const v of Object.values(n)) if (v && typeof v === 'object') visit(v, id)
  }
}
for (const {doc} of docs) visit(doc, doc._id)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
let leaks = 0
for (const u of unverified) {
  // The same value verified elsewhere (e.g. two courts both 20 ft wide) is not a leak.
  if (!u.text || verifiedTexts.has(u.text)) continue
  for (const [url, src] of html) {
    const re = new RegExp(`<span class="fact"[^>]*>${esc(u.text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    if (re.test(src)) {
      problems.push(`${url} renders unverified value "${u.text}" (${u.id})`)
      leaks++
    }
  }
}
for (const p of problems) console.log('✗', p)
console.log(`\n${pages.length} pages, ${unverified.length} unverified facts checked, ${problems.length} problems`)
process.exit(problems.length ? 1 : 0)
