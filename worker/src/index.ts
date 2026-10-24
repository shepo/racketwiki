/**
 * RacketWiki submissions queue. Public forms post here; submissions are stored in
 * D1 and never written to the public Sanity dataset. An editor reviews them at
 * /admin and approving one creates a Sanity *draft* (directoryListing or correction).
 */
export interface Env {
  DB: D1Database
  ALLOWED_ORIGINS: string
  ADMIN_PASSWORD?: string
  SANITY_PROJECT_ID?: string
  SANITY_DATASET?: string
  SANITY_WRITE_TOKEN?: string
}

type Kind = 'correction' | 'listing' | 'sponsor'
const KINDS: Kind[] = ['correction', 'listing', 'sponsor']
const LISTING_TYPES = ['governing-bodies', 'brands', 'equipment-labs', 'stats-and-records', 'software-and-apps', 'clubs-and-venues', 'coaches', 'retailers']
const ISSUE_TYPES = ['wrong', 'newer-edition', 'missing', 'renamed', 'other']
const FIELDS: Record<Kind, Record<string, number>> = {
  correction: {issueType: 30, pageUrl: 300, message: 4000, suggestedSource: 500, email: 200},
  listing: {name: 200, listingType: 40, sports: 300, region: 200, websiteUrl: 500, message: 1000, email: 200},
  sponsor: {name: 200, pageUrl: 300, message: 2000, email: 200},
}
const REQUIRED: Record<Kind, string[]> = {correction: ['pageUrl', 'message'], listing: ['name', 'listingType', 'email'], sponsor: ['name', 'email']}
const PER_HOUR = 10

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    try {
      if (url.pathname === '/api/submit') {
        if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors(req, env)})
        if (req.method === 'POST') return await submit(req, env)
      }
      if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
        const denied = checkAdmin(req, env)
        if (denied) return denied
        if (req.method === 'GET' && url.pathname === '/admin') return await adminList(env, url)
        const m = url.pathname.match(/^\/admin\/([a-f0-9-]{36})\/(approve|reject)$/)
        if (m && req.method === 'POST') {
          if (!sameOrigin(req)) return new Response('Forbidden', {status: 403})
          return await review(env, m[1], m[2] as 'approve' | 'reject')
        }
      }
      return new Response('Not found', {status: 404})
    } catch (e) {
      console.error(e)
      return json({error: 'Server error'}, 500, cors(req, env))
    }
  },
}

function cors(req: Request, env: Env): HeadersInit {
  const origin = req.headers.get('origin') ?? ''
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  return allowed.includes(origin) ? {'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type, accept', vary: 'origin'} : {}
}

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {status, headers: {'content-type': 'application/json', ...headers}})

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function readBody(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get('content-type') ?? ''
  if (type.includes('application/json')) return (await req.json()) as Record<string, string>
  const form = await req.formData()
  const out: Record<string, string> = {}
  form.forEach((v, k) => {
    if (typeof v === 'string') out[k] = v
  })
  return out
}

async function submit(req: Request, env: Env) {
  const headers = cors(req, env)
  const origin = req.headers.get('origin')
  if (origin && !('access-control-allow-origin' in headers)) return json({error: 'Origin not allowed'}, 403)
  const body = await readBody(req)
  const wantsJson = (req.headers.get('accept') ?? '').includes('application/json')
  const kind = body.kind as Kind
  if (!KINDS.includes(kind)) return json({error: 'Unknown form'}, 400, headers)
  // Honeypot: bots fill every field. Pretend success.
  if (body.website_url) return done()

  const payload: Record<string, string> = {}
  for (const [field, max] of Object.entries(FIELDS[kind])) {
    const v = (body[field] ?? '').toString().trim()
    if (v.length > max) return json({error: `${field} is too long`}, 400, headers)
    if (v) payload[field] = v
  }
  for (const f of REQUIRED[kind]) if (!payload[f]) return json({error: `Please fill in ${f}`}, 400, headers)
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return json({error: 'Please check your email address'}, 400, headers)
  if (kind === 'correction' && payload.issueType && !ISSUE_TYPES.includes(payload.issueType)) return json({error: 'Unknown correction type'}, 400, headers)
  if (kind === 'listing' && !LISTING_TYPES.includes(payload.listingType)) return json({error: 'Unknown listing type'}, 400, headers)
  if (payload.websiteUrl && !/^https?:\/\//i.test(payload.websiteUrl)) return json({error: 'Website must start with http:// or https://'}, 400, headers)

  const ipHash = await sha256((req.headers.get('cf-connecting-ip') ?? 'unknown') + new Date().toISOString().slice(0, 10))
  const recent = await env.DB.prepare(`SELECT count(*) AS n FROM submissions WHERE ip_hash = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 hour')`).bind(ipHash).first<{n: number}>()
  if ((recent?.n ?? 0) >= PER_HOUR) return json({error: 'Too many submissions, please try again later'}, 429, headers)

  const email = payload.email ?? null
  delete payload.email
  await env.DB.prepare('INSERT INTO submissions (id, kind, payload, email, ip_hash) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), kind, JSON.stringify(payload), email, ipHash)
    .run()
  return done()

  function done() {
    if (wantsJson) return json({ok: true}, 200, headers)
    const back = safeReturn(body.return, env)
    return back ? Response.redirect(back, 303) : new Response('Thank you. An editor will review your submission.', {status: 200})
  }
}

function safeReturn(ret: string | undefined, env: Env) {
  if (!ret) return null
  try {
    const u = new URL(ret)
    if (!env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).includes(u.origin)) return null
    u.searchParams.set('sent', '1')
    return u.toString()
  } catch {
    return null
  }
}

// --- Admin -------------------------------------------------------------------

function checkAdmin(req: Request, env: Env): Response | null {
  if (!env.ADMIN_PASSWORD) return new Response('Admin is not configured', {status: 503})
  const auth = req.headers.get('authorization') ?? ''
  const [scheme, encoded] = auth.split(' ')
  if (scheme === 'Basic' && encoded) {
    // Username is ignored; only the password is checked. Everything after the first colon is the password.
    const decoded = atob(encoded)
    const pass = decoded.slice(decoded.indexOf(':') + 1)
    if (pass && timingSafeEqual(pass, env.ADMIN_PASSWORD)) return null
  }
  return new Response('Authentication required', {status: 401, headers: {'www-authenticate': 'Basic realm="RacketWiki submissions"'}})
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

function sameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  return !origin || origin === new URL(req.url).origin
}

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]!)

type Row = {id: string; kind: Kind; status: string; payload: string; email: string | null; created_at: string; sanity_id: string | null}

async function adminList(env: Env, url: URL) {
  const status = ['pending', 'approved', 'rejected'].includes(url.searchParams.get('status') ?? '') ? url.searchParams.get('status')! : 'pending'
  const {results} = await env.DB.prepare('SELECT * FROM submissions WHERE status = ? ORDER BY created_at DESC LIMIT 200').bind(status).all<Row>()
  const rows = results
    .map((r) => {
      const p = JSON.parse(r.payload) as Record<string, string>
      const fields = Object.entries(p).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')
      const actions =
        r.status === 'pending'
          ? `<form method="post" action="/admin/${r.id}/approve"><button>Approve${r.kind === 'sponsor' ? ' (mark handled)' : ' → Sanity draft'}</button></form><form method="post" action="/admin/${r.id}/reject"><button>Reject</button></form>`
          : r.sanity_id
            ? `<p>Sanity draft: <code>${esc(r.sanity_id)}</code></p>`
            : ''
      return `<article><h2>${esc(r.kind)} · ${esc(r.created_at)}</h2><dl>${fields}<dt>email</dt><dd>${esc(r.email ?? '')}</dd></dl>${actions}</article>`
    })
    .join('')
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Submissions</title>
<style>body{font:16px/1.5 system-ui;margin:0 auto;max-width:860px;padding:16px}article{border-top:1px solid #ccc;padding:12px 0}dl{display:grid;grid-template-columns:max-content 1fr;gap:4px 16px}dt{font-weight:700}dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}form{display:inline-block;margin-right:8px}button{font:inherit;padding:6px 12px}</style>
<h1>Submissions: ${esc(status)}</h1><p><a href="?status=pending">Pending</a> · <a href="?status=approved">Approved</a> · <a href="?status=rejected">Rejected</a></p>${rows || '<p>Nothing here.</p>'}`
  return new Response(html, {headers: {'content-type': 'text/html; charset=utf-8', 'x-frame-options': 'DENY'}})
}

async function review(env: Env, id: string, action: 'approve' | 'reject') {
  const row = await env.DB.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first<Row>()
  if (!row) return new Response('Not found', {status: 404})
  if (row.status !== 'pending') return new Response(null, {status: 303, headers: {location: '/admin'}})
  let sanityId: string | null = null
  if (action === 'approve' && row.kind !== 'sponsor') {
    sanityId = await promoteToSanity(env, row)
  }
  await env.DB.prepare(`UPDATE submissions SET status = ?, reviewed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), sanity_id = ? WHERE id = ?`)
    .bind(action === 'approve' ? 'approved' : 'rejected', sanityId, id)
    .run()
  return new Response(null, {status: 303, headers: {location: '/admin'}})
}

/** Creates a Sanity draft. Drafts are never served by the published site. */
async function promoteToSanity(env: Env, row: Row): Promise<string> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_WRITE_TOKEN) throw new Error('Sanity is not configured')
  const p = JSON.parse(row.payload) as Record<string, string>
  const short = row.id.slice(0, 8)
  const doc =
    row.kind === 'listing'
      ? {
          _id: `drafts.dir-submitted-${short}`,
          _type: 'directoryListing',
          name: p.name,
          listingType: p.listingType,
          description: p.message,
          region: p.region,
          website: p.websiteUrl ? {_type: 'webLink', url: p.websiteUrl, status: 'verify'} : undefined,
          sponsored: false,
          submitted: true,
          section: 'directory',
          slug: {_type: 'slug', current: `${slugify(p.name)}-${short}`},
        }
      : {
          _id: `drafts.correction-${short}`,
          _type: 'correction',
          issueType: p.issueType,
          pageUrl: p.pageUrl,
          message: p.message,
          suggestedSource: p.suggestedSource,
          submittedAt: row.created_at,
          submissionId: row.id,
          status: 'open',
        }
  const res = await fetch(`https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2025-10-01/data/mutate/${env.SANITY_DATASET ?? 'production'}`, {
    method: 'POST',
    headers: {'content-type': 'application/json', authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`},
    body: JSON.stringify({mutations: [{createIfNotExists: doc}]}),
  })
  if (!res.ok) throw new Error(`Sanity mutate failed: ${res.status} ${await res.text()}`)
  return doc._id
}

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').slice(0, 60) || 'listing'
