# Cross-agent ID contract (first seed milestone)

Agents work in parallel, so these IDs are agreed up front. Reference them freely even if the
file that defines them does not exist yet. The **owner** must create each one (or report back
that it could not be verified, in which case it still creates the document but with `unverified` facts
and a `verify` source status — never invent).

## Files and owners

| Agent | Owns files |
|---|---|
| A — Bodies, sources, directory | `seed/governing-bodies.ndjson`, `seed/sources-rulebooks.ndjson`, `seed/sources-register.ndjson`, `seed/directory.ndjson` |
| B — Every sport (shallow) + courts | `seed/sports.ndjson`, `seed/courts.ndjson` |
| C — Padel (full) + real tennis | `seed/padel.ndjson`, `seed/real-tennis.ndjson` |
| D — Equipment + tennis rules | `seed/equipment.ndjson`, `seed/rules-tennis.ndjson` |
| Orchestrator | `seed/editorial.ndjson` (stories, pages, sponsor placements, Rallio) |

## Governing bodies (owner A, file governing-bodies.ndjson)

`gb-itf` International Tennis Federation · `gb-fip` International Padel Federation ·
`gb-bwf` Badminton World Federation · `gb-world-squash` World Squash Federation ·
`gb-ittf` International Table Tennis Federation · `gb-usa-pickleball` USA Pickleball ·
`gb-ifp` International Federation of Pickleball · `gb-tra` Tennis and Rackets Association ·
`gb-irf` International Racquetball Federation · `gb-apta` American Platform Tennis Association ·
`gb-istf` International Soft Tennis Federation · `gb-ico` International Crossminton Organisation ·
`gb-fipv` International Federation of Basque Pelota (FIPV)

A may add more (e.g. other pickleball bodies, ball badminton, paddle tennis) and lists them in its report.

## Rulebook sources (owner A, file sources-rulebooks.ndjson)

`source-itf-rules` ITF Rules of Tennis · `source-fip-rules` FIP Rules of Padel ·
`source-bwf-laws` BWF Laws of Badminton · `source-world-squash-rules` World Squash singles rules ·
`source-ittf-handbook` ITTF Statutes/Handbook (Laws of Table Tennis) ·
`source-usa-pickleball-rulebook` USA Pickleball Official Rulebook ·
`source-irf-rules` IRF rules of racquetball · `source-apta-rules` APTA platform tennis rules ·
`source-tra-website` Tennis and Rackets Association website ·
`source-itf-beach-tennis-rules` ITF Beach Tennis rules · `source-ico-rules` Crossminton rules ·
`source-istf-rules` Soft tennis rules · `source-fipv-rules` FIPV rules/regulations

Other agents who need an extra source create it in their own file with an ID **not** in this list
(grep `seed/` first to avoid duplicates; prefix with the publisher).

## Equipment (owner D, file equipment.ndjson)

Rackets/paddles/bats: `eq-tennis-racket`, `eq-padel-racket`, `eq-badminton-racket`, `eq-squash-racket`,
`eq-pickleball-paddle`, `eq-table-tennis-bat`, `eq-racquetball-racket`
Balls: `ball-tennis`, `ball-padel`, `ball-badminton` (shuttle), `ball-squash`, `ball-pickleball`, `ball-table-tennis`, `ball-racquetball`
Nets: `net-tennis`, `net-padel`, `net-badminton`, `net-pickleball`, `net-table-tennis`
Rules: `rules-tennis` (file rules-tennis.ndjson)

## Sports and courts (owner B, except where noted)

Sport IDs `sport-<slug>` for every slug in CONVENTIONS.md. **C** owns `sport-padel`, `court-padel`,
`rules-padel`, `sport-real-tennis`, `court-real-tennis`. B owns every other `sport-*` and `court-*`
(including `court-tennis`, `court-pickleball`, `court-squash`, `court-badminton`, `court-table-tennis`, `court-rackets`).
