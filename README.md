# RacketWiki

The sourced reference for every racket sport: rules, courts, equipment, brands, players, competitions, governing bodies and a directory. Static site on Cloudflare, content in Sanity.

```
web/      Astro site (static, Pagefind search)
studio/   Sanity Studio and schema
worker/   Submissions queue (Cloudflare Worker + D1)
seed/     Seed content as NDJSON (also what the site builds from until Sanity is connected)
scripts/  Seed validation and import
```

## Run it

```bash
npm install
npm test               # unit conversion tests
npm run validate:seed  # check every fact has a source or is marked unverified
npm run build          # builds web/dist from Sanity, or from seed/ if SANITY_PROJECT_ID is unset
npm run preview -w web # serve the built site (search works here)
npm run studio         # Sanity Studio on http://localhost:3333 (needs SANITY_STUDIO_PROJECT_ID)
```

Setup and deployment: [docs/setup.md](docs/setup.md). Project brief and rules for contributors (and Claude): [CLAUDE.md](CLAUDE.md).
