# RacketWiki: orchestrator brief

You are the orchestrator for building **RacketWiki** (racketwiki.org), the authoritative, news-style source of truth for every racket sport, from the well known to the obscure. Owner: Jake Shepherd (founder of Rallio, runs MSDC). Read this whole file before doing anything. When a decision here conflicts with your instincts, this file wins. Ask Jake only when something is genuinely undecided (see "Open decisions").

## 1. What we are building

A reference site covering, for every racket sport: rules, equipment (rackets, bats, balls, nets), court sizes, brands, top players, competitions, governing bodies and associations worldwide, plus a directory of external providers.

Strategy, in Jake's words: build a source of truth; add more content and pages under sections as ideas emerge; links back to Rallio; in future let people sponsor sections; allow submissions; very good SEO.

The white space we occupy: no all-racket-sports authoritative reference exists beyond Wikipedia. Our edge is a cross-sport structured layer (the same fields for every sport, so things can be compared), the long-tail sports, a neutral cross-sport directory, and court dimensions for every sport.

## 2. Stack (fixed)

| Layer | Choice |
|---|---|
| Content + editing | **Sanity** (Studio, GROQ). Free plan to start. Public dataset only. |
| Code + schema | **Git**, GitHub repo `shepo/racketwiki` |
| Hosting + edge | **Cloudflare** (Pages or Workers). Rebuild on Sanity publish webhook. |
| Submissions queue | Cloudflare **Worker + D1**. Never write submissions into the public Sanity dataset. Approved items are promoted to Sanity as drafts. |
| Search | Static index bundled at build (Pagefind or equivalent). No runtime database. |
| Assistant | Claude, using Sanity MCP where connected |

Not used, do not introduce: Supabase, Notion as source of truth, WordPress, Webflow, MediaWiki.

Build the site **statically** (Astro preferred; justify if you choose otherwise). Pages must be fast, crawlable and fully server-rendered.

## 3. Content principles (non-negotiable)

1. **Source of truth.** Every fact that could be wrong carries: `source` (reference to a Source document), `tier` (1 to 5), and `verifiedOn` (date). No fact without a source. Where we do not know yet, store it as `unverified: true` with the placeholder visible in the Studio and **never rendered as fact on the public site**. Do not invent figures, names, dates or domains.
2. **Source tiers.** Tier 1 governing bodies and official rulebooks; Tier 2 national bodies and major tournament/tour organisations; Tier 3 manufacturers and recognised testing labs; Tier 4 stats and records bodies; Tier 5 reputable press and community. Higher tier wins a conflict. Tier is shown beside the source on the page. The Sources page lists each source with status "Researched" or "Verify domain". Show a domain only when Researched.
3. **Units.** Store metric canonically (millimetres, grams, metres). Derive imperial at build. Show both everywhere: `20 m × 10 m (65 ft 7 in × 32 ft 10 in)`. Never store both by hand.
4. **Corrections.** Every page has "Spotted a mistake" which feeds the submissions queue.
5. **Terminology.** Say "competitions" and "box leagues". Never "comps". British English.

## 4. Information architecture

Ten colour-coded sections. Colour is always paired with a text label (accessibility). Use these tokens.

| Section | Colour |
|---|---|
| Sports | `#0a6b4c` |
| Rules | `#1d4ed8` |
| Equipment | `#9a4a00` |
| Courts | `#6d28d9` |
| Brands | `#be185d` |
| Players | `#0e7490` |
| Competitions | `#4d7c0f` |
| Governing bodies | `#b91c1c` |
| Directory | `#7a6200` |
| Sources | `#475569` |

Root-level nav shows five items: Sports, Equipment, Courts, Directory, Sources. The other sections (Rules, Brands, Players, Competitions, Governing bodies) are **sub-sections of a sport page but also root-level searchable**: each has its own index route and appears as a search filter.

**Sport page** is a tabbed hub: Overview, Rules, Equipment, Courts, Brands, Players, Competitions, Organisations. Each section on the page has a coloured rule and ends with colour-coded jump links to the other sections. Content needs many jumping-off points between sections; add cross-links generously. Include Related sports.

**Formats** (e.g. singles, doubles, mixed, ladders, box leagues) are a section on each sport page, because Rallio's community runs them.

**Directory** types: Governing bodies, Brands, Equipment labs, Stats and records, Software and apps, Clubs and venues, Coaches, Retailers. Clubs, coaches and retailers launch as empty states with a "List your business" prompt.

## 5. Design direction (decided)

- **Editorial and modern, news-like (think Washington Post), not Wikipedia.** Strong headline typography, a lead story plus supporting stories on the front page, generous whitespace.
- **No date header, no tagline, no large masthead.** Logo about 36 px, compact header.
- Fonts: **Newsreader** for headlines, **Inter** for UI. **Radio Canada Big** only inside Rallio sponsor copy.
- **Search bar** is a key feature: modest width (max about 640 px), with a "Search in" chip row: Everything, Sports, Rules, Equipment, Courts, plus a "More" menu holding Brands, Players, Competitions, Governing bodies, Directory. Chips must never wrap to a second line.
- Court diagrams are SVG, drawn to scale, labelled in metric and imperial.
- Reference prototypes exist in the Artifact "RacketWiki: editorial direction" (https://claude.ai/artifact/BVPAmDXnKyCT9ZH768Csmp): Home, Sport (Padel), Sources, Equipment, Courts, Directory. Match their look and structure. Use the source files if Jake supplies them; otherwise read the artifact.
- Layout works at phone width with 16 px gutters. Support light and dark.

## 6. Rallio sponsorship

- A "Sponsored by Rallio" strip at the top of every page, and a Rallio sponsor card in the sidebar of sport, equipment and courts pages.
- Rallio card uses Rallio's own look (olive `#37372e`, background `#fafaf7`, ink `#2b2b24`, sage `#ddddce`; Radio Canada Big). Copy: "Mixers, ladders, competitions and box leagues, all in one app." Button: "Try Rallio". Underneath: a "Sponsor this page" link to an advertising page.
- Sponsor placements are **data in Sanity** (`sponsorPlacement`: sponsor, scope = site / section / sport / page, creative, start, end), not hard-coded, so sections can be sold later.
- All paid and Rallio links carry `rel="sponsored"`, and are labelled "Sponsored". Rallio listings in the Directory are labelled Sponsored.

## 7. Sanity schema (create these)

Document types: `sport`, `ruleSet`, `equipmentSpec`, `ball`, `net`, `court`, `brand`, `player`, `competition`, `governingBody`, `directoryListing`, `source`, `sponsorPlacement`, `page` (guides and editorial), `story` (front page items).

Shared object types: `sourcedFact` (value, `source` ref, `tier`, `verifiedOn`, `unverified`), `measurement` (metric value and unit; imperial derived), `seo` (title, description, canonical, OG image).

Rules for the schema:
- Every document has a `slug`, `seo`, `section` and an `updatedAt`.
- `sport` references its `court`, `ruleSet`, equipment specs, and lists brands, players, competitions and governing bodies by reference, so cross-links are generated, not typed.
- Validation: a published document cannot contain a `sourcedFact` without a source unless `unverified` is true.
- Studio: a "Needs verification" list view of all unverified facts; this is the editor's to-do list.

## 8. SEO (very good SEO is a stated goal)

- Clean, stable URLs: `/sports/padel/`, `/sports/padel/courts/`, `/equipment/rackets/`, `/directory/governing-bodies/`.
- Unique title and meta description per page; canonical URLs; XML sitemap; `robots.txt`.
- JSON-LD: `Organization` and `WebSite` (with SearchAction) sitewide; `BreadcrumbList` on all pages; `SportsOrganization` for governing bodies; `Person` for players; `FAQPage` only where real Q&A exists; `Article` for guides.
- Answer-first copy: lead each page with the plain-language answer (for example the court size) so it can win featured snippets. Real tables for specs.
- Internal linking is generated from references. No orphan pages. Pass Core Web Vitals: no layout shift, optimised images, minimal JS.
- Submitted-content and sponsored links: `rel="sponsored"` or `rel="ugc"` as appropriate.

## 9. Seed scope (first milestone)

Goal: prove the schema, show the direction, and give Jake something real to edit. **Do not try to complete the wiki.**

**A. Every sport, shallow but correct.** One `sport` document per sport with: name, also known as, one-paragraph answer-first summary, origin, singles/doubles formats, a sourced court size, a sourced governing body, and related sports. Research the full list yourself, then confirm it with Jake. Starting point: tennis, padel, pickleball, squash, badminton, table tennis, racketball, platform tennis, real tennis, rackets, soft tennis, speedminton (crossminton), beach tennis, paddle tennis, paddleball, frescobol, matkot, ball badminton, jokari, and racket-based pelota variants. Inclusion test: played with a racket, bat or paddle that strikes a ball or shuttle. Keep a list of anything you excluded and why. Unknown facts stay `unverified`.

**B. Two or three full pages per section** to show direction and exercise every schema type:
- Sports: **Padel** as the complete reference page (all eight tabs), plus one long-tail sport (for example real tennis) to prove edge cases.
- Rules: two sports' rule summaries.
- Equipment: racket limits (cross-sport table), balls, nets, each with metric and imperial.
- Courts: the to-scale comparison page for the main sports, plus the "not standard" note (real tennis, rackets).
- Brands: two to three brands with products and sports covered.
- Players: two to three players with sourced profiles.
- Competitions: two to three, including one major tour.
- Governing bodies: the main international federations (ITF, BWF, WSF, ITTF, IPF/PPA as appropriate, FIP).
- Directory: a handful of real listings per researched type, Rallio as a labelled Sponsored listing, empty states for clubs, coaches, retailers.
- Sources: the five-tier register.

**C. Front page.** A lead story ("Four racket sports, one footprint": overlaid court outlines) plus supporting stories, drawn from `story` documents.

**D. Infrastructure.** Repo scaffold, Sanity Studio with the schema, Cloudflare deploy with the publish webhook, sitemap and structured data, the submissions Worker + D1 (form, queue, approve action), the "Sponsor this page" page.

## 10. How to orchestrate

Work in this order. Delegate independent work to sub-agents in parallel; keep schema and shared components for yourself so everything stays consistent.

1. **Scaffold** (you): repo structure, Astro, Sanity Studio, CI, Cloudflare project, design tokens (section colours, fonts), layout shell with header, search, sponsor strip, footer.
2. **Schema** (you): section 7. Get Jake's quick look at the schema before bulk content.
3. **Components** (you or one sub-agent): sport hub tabs, spec tables with unit conversion, court SVG generator (from `court` measurements, drawn to scale), source/tier badge, sponsor card, section jump links, directory filters.
4. **Research and seed content** (parallel sub-agents, one per section or group of sports): each agent works only from Tier 1 to 3 sources first, records the source and date for every fact, marks gaps `unverified`, and writes documents into Sanity (MCP if connected, otherwise as NDJSON import files in `/seed`). Agents do not touch schema or components.
5. **Independent check** (a separate agent that did not write the content): verifies a sample of facts against their cited sources, checks unit conversions by running the numbers, checks every Padel figure against the FIP rulebook, flags anything uncited.
6. **Build and review**: build the site, run Lighthouse, validate structured data, check mobile width, check that no `unverified` value renders as fact, and check internal links.

Report back concisely: what was built, what is unverified, what needs Jake's decision.

## 11. Open decisions (ask Jake, one at a time, only when blocking)

- Who edits content besides Jake, and do they need Studio seats?
- Directory open for submissions from day one, or after launch?
- Governing-body domains to confirm (Tier 1 register).
- racketwiki.org registration, and trademark overlap check (Rallio, Rally, Racketpedia) before launch. (racketwiki.org is registered, on Cloudflare: 2026-10-24.)
- Where "Sponsor this page" leads (an advertising page with rates, or a contact form).
- Product and venue reviews (raised 2026-10-24): editorial, user-submitted, or both? Needs review rules separate from fact sourcing, a sponsor conflict-of-interest policy, and Google's review rich-result rules. Not in the first milestone; the schema can add a `review` type (subject ref → brand / product / directory listing) later.
- Whether to restore and rename the Supabase projects (unrelated to this build; do not touch them).

## 12. Guardrails

- Do not publish, deploy to production, delete data, or spend money without Jake's go-ahead. Preview deployments are fine.
- Never fabricate facts, quotes, records or domains. A visible gap is better than a confident error.
- Do not copy text from Wikipedia or other sites. Write our own summaries from the cited primary sources, and link to them.
- Keep secrets (Sanity tokens, Cloudflare keys) out of the repo. Use environment variables.
- Commit in small steps with clear messages on feature branches.

## Repo map

- `web/` Astro site (static). Content loader `web/src/lib/content.ts` reads published Sanity content (settings in `web/src/site.config.ts`; `SANITY_PROJECT_ID=` empty builds from `seed/*.ndjson`). Sanity is the source of content since 2026-10-24; `seed/` feeds it through the Sync seed to Sanity workflow. Units: `web/src/lib/units.mjs` (tested, `npm test`). Facts are shown only via `isShown()` in `web/src/lib/facts.ts` — never render a `sourcedFact` any other way. Court drawing: `web/src/lib/court.ts`.
- Analytics: PostHog project RacketWiki (EU, id 319892), loaded only after the cookie banner's Accept (`web/src/components/Analytics.astro`, `web/src/scripts/analytics.ts`; custom events via `track()`: `search`, `outbound_click`). The sponsor page rail (`SponsorHighlights.astro`) reads audience figures at build from `web/src/lib/audience.ts`, which needs `POSTHOG_PERSONAL_API_KEY` in the build environment and shows no figures below 100 readers. Privacy and cookie pages: `web/src/pages/privacy.astro`, `cookies.astro`; update both if what we collect changes.
- `studio/` Sanity Studio (TypeScript) and schema in `studio/schemaTypes/`. The "Needs verification" filter in `studio/structure.ts` lists every sourcedFact path: add new ones there.
- `worker/` submissions Worker + D1 (`/api/submit`, `/admin`).
- `seed/` NDJSON seed content: read `seed/CONVENTIONS.md`; `npm run validate:seed` checks it.
- `docs/` setup and deploy notes.
