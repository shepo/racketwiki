// Builds Cloudflare Pages redirects from each document's previousSlugs, so renamed pages
// keep their old URLs. Renamed to dist/_redirects by the build script.
import {getStore} from '../lib/content'
import {urlFor} from '../lib/routes'

const PREFIX: Record<string, string> = {sport: '/sports/', governingBody: '/governing-bodies/', brand: '/brands/', competition: '/competitions/', player: '/players/'}

export async function GET() {
  const store = await getStore()
  const lines: string[] = []
  for (const [type, prefix] of Object.entries(PREFIX)) {
    for (const d of store.ofType(type)) {
      const to = urlFor(store, d)
      for (const old of d.previousSlugs ?? []) {
        if (!old || old === d.slug?.current) continue
        lines.push(`${prefix}${old}/ ${to} 301`)
        if (type === 'sport') lines.push(`${prefix}${old}/* /sports/${d.slug.current}/:splat 301`)
      }
    }
  }
  return new Response(lines.join('\n') + '\n', {headers: {'content-type': 'text/plain'}})
}
