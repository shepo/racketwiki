/**
 * Public build settings (none of these are secrets). Environment variables override them;
 * set one to an empty string to switch it off, e.g. `SANITY_PROJECT_ID= npm run build` builds from seed/.
 */
const env = (name: string, fallback: string) => (process.env[name] ?? fallback).trim()

export const SITE = {
  /** Content source. Empty = build from ../seed/*.ndjson. */
  sanityProjectId: env('SANITY_PROJECT_ID', 'gojst4dq'),
  sanityDataset: env('SANITY_DATASET', 'production'),
  /** PostHog project RacketWiki (EU). The project key is public by design. Empty turns analytics off. */
  posthogKey: env('PUBLIC_POSTHOG_KEY', 'phc_vLQT5j4J7GMF3CVoV4myKGowU4pQ9kLAagkPne2mecZ7'),
  /** PostHog managed reverse proxy on our own domain, so ad blockers don't drop events. */
  posthogHost: env('PUBLIC_POSTHOG_HOST', 'https://p.racketwiki.org'),
  /** Submissions Worker. Empty = forms show "opening soon". */
  submissionsUrl: env('PUBLIC_SUBMISSIONS_URL', 'https://racketwiki-submission.jake-02f.workers.dev'),
}
