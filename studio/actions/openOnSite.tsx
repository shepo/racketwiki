import {useEffect, useState} from 'react'
import {LaunchIcon} from '@sanity/icons'
import {useClient, type DocumentActionComponent, type DocumentActionProps} from 'sanity'

export const SITE_URL = 'https://racketwiki.org'

/** Sport hub tab paths, mirroring web/src/lib/routes.ts. */
const TAB = {courts: 'courts/', rules: 'rules/', equipment: 'equipment/'} as const

type Target = {_type?: string; slug?: string; listingType?: string; kind?: string; path?: string; sportSlug?: string}

/** The public path for a document. Keep in step with urlFor() in web/src/lib/routes.ts. */
export function sitePath(d?: Target | null): string | null {
  if (!d?._type) return null
  const s = d.slug
  const sport = (tab: keyof typeof TAB, fallback: string) => (d.sportSlug ? `/sports/${d.sportSlug}/${TAB[tab]}` : fallback)
  switch (d._type) {
    case 'sport': return s ? `/sports/${s}/` : null
    case 'court': return sport('courts', '/courts/')
    case 'ruleSet': return sport('rules', '/rules/')
    case 'equipmentSpec':
    case 'ball':
    case 'net': return sport('equipment', '/equipment/')
    case 'venue': return s ? `/venues/${s}/` : null
    case 'ratingSystem': return s ? `/ratings/${s}/` : null
    case 'brand': return s ? `/brands/${s}/` : null
    case 'player': return s ? `/players/${s}/` : null
    case 'competition': return s ? `/competitions/${s}/` : null
    case 'governingBody': return s ? `/governing-bodies/${s}/` : null
    case 'directoryListing': return d.listingType ? `/directory/${d.listingType}/${s ? `#${s}` : ''}` : '/directory/'
    case 'source': return s ? `/sources/#${s}` : '/sources/'
    case 'page': return s ? (d.kind === 'guide' ? `/guides/${s}/` : `/${s}/`) : null
  }
  return null
}

const FIELDS = '_type, "slug": slug.current, listingType, kind, path, "sportSlug": sport->slug.current'
const QUERY = `*[_id == $id][0]{${FIELDS}, link->{${FIELDS}}}`

/**
 * "Open on racketwiki.org": opens the published document's page in a new tab. Pages are
 * built from published content, so it is disabled until the document has been published,
 * and shows the page as it was at the last site build.
 */
export const openOnSite: DocumentActionComponent = (props: DocumentActionProps) => {
  const client = useClient({apiVersion: '2024-01-01'})
  const [path, setPath] = useState<string | null>(null)
  const published = props.published
  useEffect(() => {
    let live = true
    if (!published) return setPath(null)
    client.fetch<Target & {link?: Target}>(QUERY, {id: props.id}).then((d) => {
      if (!live) return
      // A front page story opens whatever it links to.
      setPath(d?._type === 'story' ? d.path || sitePath(d.link) : sitePath(d))
    })
    return () => {
      live = false
    }
  }, [client, props.id, published?._rev])
  return {
    label: 'Open on racketwiki.org',
    icon: LaunchIcon,
    disabled: !path,
    title: !published ? 'Publish first: the site shows published content only' : !path ? 'This document has no page of its own' : 'Opens the live page (as of the last site build)',
    onHandle: () => {
      if (path) window.open(`${SITE_URL}${path}`, '_blank', 'noopener')
      props.onComplete()
    },
  }
}
