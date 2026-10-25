/**
 * Audience highlights for the sponsor page, read from PostHog when the site is built.
 * Needs POSTHOG_PERSONAL_API_KEY (a personal key with query:read on the RacketWiki project) in the
 * build environment. Without it, or below MIN_VISITORS, the page shows content highlights only.
 */
const API = (process.env.POSTHOG_API_HOST ?? 'https://eu.posthog.com').trim()
const PROJECT = (process.env.POSTHOG_PROJECT_ID ?? '319892').trim()
const TOKEN = (process.env.POSTHOG_PERSONAL_API_KEY ?? '').trim()
export const MIN_VISITORS = 100
const DAYS = 30

export type Audience = {
  days: number
  measuredOn: string
  visitors: number
  pageviews: number
  sessions: number
  searches: number
  topSports: {slug: string; views: number}[]
  topPages: {path: string; title: string; views: number}[]
}

async function hogql(query: string): Promise<any[][]> {
  const res = await fetch(`${API}/api/projects/${PROJECT}/query/`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({query: {kind: 'HogQLQuery', query}}),
  })
  if (!res.ok) throw new Error(`PostHog query failed (${res.status})`)
  return (await res.json()).results ?? []
}

let cached: Promise<Audience | null> | undefined

export function getAudience(): Promise<Audience | null> {
  if (!TOKEN) return Promise.resolve(null)
  cached ??= (async () => {
    const since = `timestamp > now() - INTERVAL ${DAYS} DAY`
    try {
      const [[totals], [[searches]], sports, pages] = await Promise.all([
        hogql(`SELECT count(DISTINCT distinct_id), count(), count(DISTINCT $session_id) FROM events WHERE event = '$pageview' AND ${since}`),
        hogql(`SELECT count() FROM events WHERE event = 'search' AND ${since}`),
        hogql(`SELECT properties.sport, count() AS n FROM events WHERE event = '$pageview' AND ${since} AND properties.sport IS NOT NULL GROUP BY properties.sport ORDER BY n DESC LIMIT 5`),
        hogql(`SELECT properties.$pathname, any(properties.title), count() AS n FROM events WHERE event = '$pageview' AND ${since} GROUP BY properties.$pathname ORDER BY n DESC LIMIT 5`),
      ])
      return {
        days: DAYS,
        measuredOn: new Date().toISOString().slice(0, 10),
        visitors: Number(totals?.[0] ?? 0),
        pageviews: Number(totals?.[1] ?? 0),
        sessions: Number(totals?.[2] ?? 0),
        searches: Number(searches ?? 0),
        topSports: sports.map(([slug, n]) => ({slug: String(slug), views: Number(n)})),
        topPages: pages.map(([path, title, n]) => ({path: String(path), title: String(title ?? '').replace(/ \| RacketWiki$/, ''), views: Number(n)})),
      }
    } catch (e) {
      console.warn(`[audience] ${(e as Error).message}; showing content highlights only`)
      return null
    }
  })()
  return cached
}
