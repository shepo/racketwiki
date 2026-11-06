/**
 * Drops pages marked <meta name="robots" content="noindex"> from the built sitemaps, so the
 * sitemap never asks Google to index a page that tells it not to (Search Console reports that
 * as "Excluded by 'noindex' tag"). Runs after astro build; reads dist/.
 */
import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve(process.argv[2] ?? 'dist')
const site = 'https://racketwiki.org'
let dropped = 0
for (const file of fs.readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
  const xml = fs.readFileSync(path.join(dist, file), 'utf8')
  const out = xml.replace(/<url>.*?<\/url>/gs, (entry) => {
    const loc = entry.match(/<loc>(.*?)<\/loc>/)?.[1] ?? ''
    if (!loc.startsWith(site)) return entry
    const html = path.join(dist, loc.slice(site.length), 'index.html')
    if (fs.existsSync(html) && /<meta name="robots" content="[^"]*noindex/i.test(fs.readFileSync(html, 'utf8'))) {
      dropped++
      return ''
    }
    return entry
  })
  fs.writeFileSync(path.join(dist, file), out)
}
console.log(`sitemap: dropped ${dropped} noindex page(s)`)
