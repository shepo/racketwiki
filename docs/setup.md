# Setup and deployment

Nothing here has been deployed yet. Each step needs Jake's go-ahead where it publishes or costs money.

## 1. Sanity

1. Create the project at sanity.io/manage (name `racketwiki`, dataset `production`, public). The Studio and schema are already in `studio/`, so skip the template.
2. Put the project ID (not a secret) in `studio/.env` as `SANITY_STUDIO_PROJECT_ID` and in the Cloudflare build settings as `SANITY_PROJECT_ID`.
3. Create an **Editor** API token. Keep it in environment variables only (`SANITY_WRITE_TOKEN`), never in the repo.
4. CORS origins: `http://localhost:3333` now; the workers.dev preview address and `https://racketwiki.org` later.
5. Import the seed: `cd studio && SANITY_AUTH_TOKEN=… npm run import:seed` (validates first; refuses on errors).
6. Run the Studio: `npm run studio`. The "Needs verification" list is the editor's to-do list.

## 2. Website on Cloudflare (Workers static assets)

The site is a Worker named `racketwiki` that serves `web/dist` as static assets (`wrangler.jsonc` at the repo root). It is connected to the GitHub repo through Workers Builds.

- Settings → Build. Production and non-production branches each have their **own** commands, and both need the build step:

  | | Build command | Deploy command |
  |---|---|---|
  | Production branch | `npm run build` | `npx wrangler deploy` |
  | Non-production branches | `npm run build` | `npx wrangler versions upload` |

  Root directory `/`. Node comes from `.node-version` (22).
- Each branch gets a stable preview address, e.g. `https://claude-charming-keller-vb31t5-racketwiki.jake-02f.workers.dev`. Only the workers.dev addresses send `X-Robots-Tag: noindex` (`web/public/_headers`); racketwiki.org is indexed (since launch, 2026-10-25).
- Environment variables (once content comes from Sanity): `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `PUBLIC_SUBMISSIONS_URL` (the submissions Worker URL). Without `SANITY_PROJECT_ID` the site builds from `seed/`.
- Custom domain: `racketwiki.org` (already on Cloudflare) once Jake approves going live.
- **Rebuild on publish:** in the Worker's Settings → Build, create a deploy hook. In Sanity → API → Webhooks, add it as a webhook on create/update/delete of published documents (filter `!(_id in path("drafts.**"))`). Every publish then rebuilds the site.

## Analytics (PostHog)

The site sends analytics to the PostHog project **RacketWiki** (EU) only after a reader accepts the cookie banner. The project key is public and lives in `web/src/site.config.ts`.

For audience figures on the sponsor page, add one **build** variable to the `racketwiki` Worker (Settings → Build → Variables and secrets):

- `POSTHOG_PERSONAL_API_KEY`: a PostHog personal API key (posthog.com → Settings → Personal API keys) limited to the RacketWiki project with **Query: read** only. Mark it as a secret.

Figures refresh on each build and appear once 100 readers have been counted in the last 30 days.

## Rebuild on publish (Deploy Hook + Sanity webhook)

The site is static: it reads Sanity when it builds. A Cloudflare Deploy Hook plus a Sanity webhook
rebuild it whenever a document is published, unpublished or deleted (about two minutes end to end).

1. **Cloudflare:** Workers & Pages → `racketwiki` → Settings → Builds → Deploy Hooks → Create.
   Name it `Sanity publish` and choose the **production branch** (today `claude/charming-keller-vb31t5`;
   `main` after launch, when the hook must be recreated for `main`). Copy the URL. Treat it as a
   secret: anyone with it can start builds. Do not commit it or paste it into chat.
2. **Sanity:** sanity.io/manage → RacketWiki → API → Webhooks → Create webhook:
   - Name: `Rebuild racketwiki.org`; URL: the Deploy Hook URL; Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type != "correction"` (correction reports are Studio-only)
   - Leave Projection empty, Drafts unticked (only published changes rebuild), Status enabled
   - HTTP method: POST; leave secret and headers empty
3. Publish any small edit and check the build appears under the Worker's Deployments
   (its source shows the Deploy Hook name).

Cloudflare skips duplicate builds when several publishes arrive before a build starts, and allows
10 builds a minute per Worker.

## 3. Submissions Worker

Live as the Worker **`racketwiki-submission`** at `https://racketwiki-submission.jake-02f.workers.dev`, connected to the repo through Workers Builds:

- Build command: empty. Deploy command: `npx wrangler deploy -c worker/wrangler.toml`. Root directory `/`.
- D1 database `racketwiki-submissions` (id in `worker/wrangler.toml`), migration 0001 applied.
- Secrets (Worker → Settings → Variables and Secrets): `ADMIN_PASSWORD`, `SANITY_WRITE_TOKEN` (Sanity Editor token).
- The site needs `PUBLIC_SUBMISSIONS_URL` set to the Worker address in its build variables, or the forms show "opening soon".

- Forms on the site post to `/api/submit` (corrections, directory listings, sponsor enquiries). Only origins in `ALLOWED_ORIGINS` are accepted; there is a honeypot and a 10-per-hour limit per visitor.
- Editors review at `https://<worker>/admin` (basic auth). Approving a listing creates a **draft** `directoryListing` in Sanity; approving a correction creates a draft `correction` report. Nothing reaches the public dataset until an editor publishes it in the Studio.
- Recommended before launch: put `/admin` behind Cloudflare Access as well as the password.

Local test: `npx wrangler d1 migrations apply racketwiki-submissions --local && npx wrangler dev`.

## Syncing the seed to Sanity

Run the **Sync seed to Sanity** workflow (GitHub → Actions) to write `seed/*.ndjson` to Sanity as published documents (`scripts/sync-sanity.mjs`, needs the `SANITY_WRITE_TOKEN` repository secret). `create-missing` (default) only adds new documents; `replace` overwrites seed documents and discards their drafts, so it would undo Studio edits. Sanity became the source of content on 2026-10-24.

## Importing the seed as drafts (no API token needed)

`node scripts/build-drafts.mjs` validates the seed and writes `seed/dist/drafts-*.json` batches. References are written as weak with `_strengthenOnPublish`, as the Studio does for links to unpublished documents, so drafts can point at each other. Each batch is passed to the Sanity MCP `create_documents` tool. Nothing is published; publishing happens in the Studio.
