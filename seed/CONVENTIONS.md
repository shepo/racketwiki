# Seed content conventions

Seed content lives in `seed/*.ndjson`: one Sanity document per line, in the shape
`sanity dataset import` accepts. The site builds from these files when no Sanity
project is configured, and `npm run validate:seed` checks them.

Each research agent owns specific files (see below) and must not edit anyone else's.

## IDs

| Type | `_id` pattern | Example |
|---|---|---|
| sport | `sport-<slug>` | `sport-padel` |
| court | `court-<sport-slug>` | `court-padel` |
| ruleSet | `rules-<sport-slug>` | `rules-padel` |
| equipmentSpec | `eq-<sport-slug>-<item>` | `eq-padel-racket` |
| ball | `ball-<sport-slug>` | `ball-padel` |
| net | `net-<sport-slug>` | `net-padel` |
| venue | `venue-<slug>` | `venue-wimbledon` |
| brand | `brand-<slug>` | `brand-bullpadel` |
| player | `player-<slug>` | `player-firstname-lastname` |
| competition | `comp-<slug>` | `comp-premier-padel` |
| governingBody | `gb-<slug>` | `gb-fip` |
| directoryListing | `dir-<slug>` | `dir-rallio` |
| source | `source-<publisher>-<doc>` | `source-fip-rules` |
| story / page | `story-<slug>` / `page-<slug>` | |

`slug` is always `{"_type":"slug","current":"<slug>"}`. Sport slugs are lower-case, hyphenated:
`tennis, padel, pickleball, squash, badminton, table-tennis, racquetball, platform-tennis,
real-tennis, rackets, soft-tennis, crossminton, beach-tennis, paddle-tennis, paddleball, frescobol,
matkot, ball-badminton, jokari, frontenis, pelota-paleta, xare, squash57 (also known as racketball)` (agents may add more; report additions).

## References

`{"_type":"reference","_ref":"<id>"}`. Arrays of references and array objects need a `_key`
(any unique short string, e.g. `"_key":"k1"`).

## sourcedFact (the core rule)

```json
{"_type":"sourcedFact","text":"Underhand, struck at or below waist height",
 "source":{"_type":"reference","_ref":"source-fip-rules"},"citation":"Rule 6",
 "tier":1,"verifiedOn":"2026-10-24","unverified":false}
```

A measurement instead of text (metric only; never store imperial):

```json
{"_type":"sourcedFact","measurement":{"_type":"measurement","value":20,"unit":"m"},"qualifier":"exact", ...}
```

Units: `mm`, `cm`, `m`, `g`, `kg`. `qualifier`: `exact | max | min | range | approx` (`range` uses `valueTo`).

If you could not confirm a fact from a source you actually opened, write it as:

```json
{"_type":"sourcedFact","unverified":true,"editorNote":"Commonly cited as 20 m; FIP PDF not reachable"}
```

You may put a best-known value in `text`/`measurement` of an unverified fact for the editor, but it
**is never shown on the site**. Never invent figures, names, dates or URLs.

`tier` = the tier of the source. `verifiedOn` = the date you checked it (today: 2026-10-24).

## source

```json
{"_id":"source-fip-rules","_type":"source","name":"Rules of Padel","publisher":"International Padel Federation",
 "tier":1,"kind":"rulebook","edition":"2024","url":"https://...","status":"researched","accessedOn":"2026-10-24",
 "usedFor":"Rules, court dimensions, equipment limits","slug":{"_type":"slug","current":"fip-rules"},"section":"sources"}
```

`status` is `researched` only if you actually loaded the URL (or a page on that domain) and it is the official
site. Otherwise `verify`, and leave `url` empty if you are not sure of it.

Tiers: 1 governing bodies and official rulebooks; 2 national bodies, tours, tournament organisers;
3 manufacturers and test labs; 4 stats and records bodies; 5 reputable press and community.

## Writing

- British English. Say "competitions" and "box leagues", never "comps".
- Write summaries in your own words. Never copy text from Wikipedia or any site.
- Answer first: the first sentence answers the obvious question (what it is, how big the court is).
- Wikipedia may point you to primary sources but is never the cited source.

## Common fields

Every document has `slug`, `section`, and optional `updatedAt` (ISO datetime) and `seo` `{title, description}`.
`section` values: `sports, rules, equipment, courts, brands, players, competitions, governing-bodies, directory, sources`.

## Patches (changes to documents already in Sanity)

`seed/patches/*.json` holds `[{"id": "<doc id>", "set": {"<field or path>": <value>}}]`. The Sync seed to
Sanity workflow in `patches` mode applies every file directly in `seed/patches/`. Once a file has been
applied, move it to `seed/patches/applied/` (kept as a record, never run again), so a later run cannot
overwrite edits made in the Studio since.
