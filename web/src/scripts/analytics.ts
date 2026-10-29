/**
 * Consent-gated analytics. PostHog is imported only after the reader accepts; before that,
 * and after a reject, nothing is loaded, sent or stored. Pages call `track()` for custom events.
 */
const KEY = 'rw_consent'
type Consent = 'granted' | 'denied'
type PostHog = typeof import('posthog-js').default
let ph: PostHog | undefined
const queue: [string, Record<string, unknown>][] = []

function read(): Consent | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

function write(v: Consent) {
  try {
    localStorage.setItem(KEY, v)
  } catch {}
}

/** What kind of page this is, read from the address: section, sport and tab. */
function pageContext() {
  const parts = location.pathname.split('/').filter(Boolean)
  const kind = parts[0] ?? 'home'
  const ctx: Record<string, string> = {page_kind: kind}
  if (kind === 'sports' && parts[1]) {
    ctx.sport = parts[1]
    ctx.sport_tab = parts[2] ?? 'overview'
  }
  if (kind !== 'sports' && parts[1]) ctx.item = parts[1]
  const section = document.body.dataset.section
  if (section) ctx.section = section
  return ctx
}

async function start(key: string, host: string) {
  if (ph) return
  const {default: posthog} = await import('posthog-js')
  posthog.init(key, {
    api_host: host,
    // Behind the proxy, links in the toolbar and elsewhere still need to point at PostHog itself.
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    persistence: 'localStorage+cookie',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: true,
    respect_dnt: true,
    loaded: (p) => p.register(pageContext()),
  })
  ph = posthog
  for (const [name, props] of queue.splice(0)) ph.capture(name, props)
}

/** Forget everything analytics stored in this browser. */
function wipe() {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith('ph_')) localStorage.removeItem(k)
  } catch {}
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (name.startsWith('ph_')) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
  }
}

export function track(name: string, props: Record<string, unknown> = {}) {
  if (ph) ph.capture(name, props)
  else if (read() === 'granted') queue.push([name, props])
}

export function initConsent() {
  const box = document.getElementById('cc')
  if (!box) return
  const key = box.dataset.key!
  const host = box.dataset.host!
  const choice = read()
  if (choice === 'granted') start(key, host)
  else if (choice === null) box.hidden = false

  box.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((b) =>
    b.addEventListener('click', () => {
      const v = b.dataset.consent as Consent
      write(v)
      box.hidden = true
      if (v === 'granted') start(key, host)
      else {
        ph?.opt_out_capturing()
        wipe()
      }
    }),
  )
  // "Cookie settings" links reopen the banner.
  document.querySelectorAll('[data-cookie-settings]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault()
      box.hidden = false
      box.querySelector<HTMLButtonElement>('[data-consent="granted"]')?.focus()
    }),
  )
  // Links that leave the site, including sponsored ones.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a || a.host === location.host || !a.protocol.startsWith('http')) return
    const rel = a.rel ?? ''
    track('outbound_click', {
      domain: a.hostname.replace(/^www\./, ''),
      url: a.href,
      sponsored: rel.includes('sponsored'),
      placement: a.closest('[aria-label="Sponsored"]') ? 'sponsor_card' : a.closest('.strip') ? 'sponsor_strip' : undefined,
    })
  })
}
