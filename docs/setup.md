# Setup and deployment

Nothing here has been deployed yet. Each step needs Jake's go-ahead where it publishes or costs money.

## 1. Sanity

1. Create the project at sanity.io/manage (name `racketwiki`, dataset `production`, public). The Studio and schema are already in `studio/`, so skip the template.
2. Put the project ID (not a secret) in `studio/.env` as `SANITY_STUDIO_PROJECT_ID` and in Cloudflare Pages as `SANITY_PROJECT_ID`.
3. Create an **Editor** API token. Keep it in environment variables only (`SANITY_WRITE_TOKEN`), never in the repo.
4. CORS origins: `http://localhost:3333` now; the Pages preview URL and `https://racketwiki.org` later.
5. Import the seed: `cd studio && SANITY_AUTH_TOKEN=… npm run import:seed` (validates first; refuses on errors).
6. Run the Studio: `npm run studio`. The "Needs verification" list is the editor's to-do list.

## 2. Website on Cloudflare Pages

- Connect the GitHub repo `shepo/racketwiki` in Cloudflare Pages.
- Build command `npm run build`, output directory `web/dist`, Node 22.
- Environment variables: `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `PUBLIC_SUBMISSIONS_URL` (the Worker URL).
- Custom domain: `racketwiki.org` (already on Cloudflare) once Jake approves going live.
- **Rebuild on publish:** in Pages → Settings → Builds, create a deploy hook. In Sanity → API → Webhooks, add it as a webhook on create/update/delete of published documents (filter `!(_id in path("drafts.**"))`). Every publish then rebuilds the site.

## 3. Submissions Worker

```bash
cd worker
npx wrangler d1 create racketwiki-submissions      # paste the id into wrangler.toml
npx wrangler d1 migrations apply racketwiki-submissions --remote
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SANITY_WRITE_TOKEN
# set SANITY_PROJECT_ID in wrangler.toml [vars]
npx wrangler deploy
```

- Forms on the site post to `/api/submit` (corrections, directory listings, sponsor enquiries). Only origins in `ALLOWED_ORIGINS` are accepted; there is a honeypot and a 10-per-hour limit per visitor.
- Editors review at `https://<worker>/admin` (basic auth). Approving a listing creates a **draft** `directoryListing` in Sanity; approving a correction creates a draft `correction` report. Nothing reaches the public dataset until an editor publishes it in the Studio.
- Recommended before launch: put `/admin` behind Cloudflare Access as well as the password.

Local test: `npx wrangler d1 migrations apply racketwiki-submissions --local && npx wrangler dev`.

## Importing the seed as drafts (no API token needed)

`node scripts/build-drafts.mjs` validates the seed and writes `seed/dist/drafts-*.json` batches. References are written as weak with `_strengthenOnPublish`, as the Studio does for links to unpublished documents, so drafts can point at each other. Each batch is passed to the Sanity MCP `create_documents` tool. Nothing is published; publishing happens in the Studio.
