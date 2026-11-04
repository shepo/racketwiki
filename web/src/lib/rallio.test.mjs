import test from 'node:test'
import assert from 'node:assert/strict'
import {ALLOWED, FORMAT_LINKS, PAGE_LINKS, formatLinksFor} from './rallio.mjs'

const all = [...Object.values(FORMAT_LINKS), ...Object.values(PAGE_LINKS)]

test('editorial Rallio links: allowed URL, trailing slash, no tracking', () => {
  for (const links of all)
    for (const l of links) {
      assert.ok(ALLOWED.has(l.url), `${l.url} is not an allowed page`)
      assert.ok(l.url.endsWith('/'), `${l.url} needs its trailing slash`)
      assert.ok(!/[?#]/.test(l.url), `${l.url} must carry no query or UTM tags`)
    }
})

test('editorial Rallio links: at most 2 per page', () => {
  for (const links of all) assert.ok(links.length <= 2)
})

test('editorial Rallio links: anchor describes the page', () => {
  for (const links of all)
    for (const l of links) {
      assert.ok(!/click here|^here$|^rallio$/i.test(l.anchor.trim()), `bad anchor "${l.anchor}"`)
      assert.ok(!/\bcomps?\b/i.test(`${l.before}${l.anchor}${l.after}`), 'say "competitions"')
    }
})

test('editorial Rallio links: a sport links only to its own or general pages', () => {
  const SPORTS = ['tennis', 'padel', 'pickleball', 'squash']
  for (const [slug, links] of Object.entries(FORMAT_LINKS))
    for (const l of links) {
      const path = new URL(l.url).pathname
      for (const s of SPORTS) if (s !== slug && (path.startsWith(`/${s}/`) || path.includes(`-${s}-`))) assert.fail(`${slug} links to a ${s} page`)
    }
})

test('formatLinksFor: unknown format falls back to its group', () => {
  const {byFormat, byGroup} = formatLinksFor('squash', [{name: 'Box leagues'}])
  assert.equal(byFormat.get('Box leagues').length, 1)
  assert.equal(byGroup.get('competitive').length, 1)
})
