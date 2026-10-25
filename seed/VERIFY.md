# Verification pass (shared brief for verification agents)

Network access is now open. Every fact in the seed is `unverified: true` because nobody could open
sources before. Your job: open the cited sources and verify facts in **your files only**.

For each `sourcedFact` in your files:
1. Open the cited source (the `source` document's `url`; if missing, find the official page on the
   publisher's own domain). Use WebFetch, or for PDFs: `curl -sL -o <scratch>/x.pdf <url>` then
   `pdftotext -layout <scratch>/x.pdf -` and grep. Put downloads in your scratchpad, not the repo.
2. If the source states the value (allowing exact unit conversion: 1 in = 25.4 mm, 1 ft = 0.3048 m,
   1 oz = 28.349523125 g): set `"unverified": false`, `"verifiedOn": "2026-10-24"`, `"tier"` = the
   source's tier, keep/fix `citation` (rule/section number as printed), and replace `editorNote` with a
   short note only if useful (e.g. "Rulebook states 78 ft"), otherwise remove it.
3. If the source gives a different value: correct `measurement`/`text` to what the source says, verify it,
   and add `editorNote: "Corrected from <old> on 2026-10-24"`.
4. If you cannot find it in the source: leave it unverified and update `editorNote` with what you checked.
5. If the fact cites no source, or the wrong one, point it at the right source document (create one in
   your file if needed, id not already used anywhere in seed/ — grep first).

For each `source` document you own: if you loaded the URL and it is the official publisher, set
`"status": "researched"`, the exact `url`, `"accessedOn": "2026-10-24"`, and the real `edition`.
For `webLink`s (websites of bodies, brands, listings): set `status: "researched"` only after loading the
site and confirming it is the official one; fix the URL if it redirects to a different canonical domain.

Rules: never invent; never copy text from sites (summaries stay in our words; short factual phrases like
"wrist cord compulsory" are fine); British English; keep `_key`s; keep JSON one document per line.
Run `node scripts/validate-seed.mjs` at the end; it must show 0 errors.

Report back (under 250 words): counts verified / corrected / still unverified per file, every correction
(old → new, with citation), sources marked researched, and anything you need a human to decide.
