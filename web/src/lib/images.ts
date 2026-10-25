/** Sanity image URLs, built from the asset id (image-<id>-<w>x<h>-<ext>) without an extra client. */
import {SITE} from '../site.config'

export type PhotoDoc = {image?: {asset?: {_ref?: string}}; alt?: string; photographer?: string; photographerUrl?: string; site?: string; sourceUrl?: string; licence?: string}

export function photoAsset(p?: PhotoDoc | null) {
  const ref = p?.image?.asset?._ref
  const m = ref?.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/)
  if (!m) return null
  const [, id, w, h, ext] = m
  const base = `https://cdn.sanity.io/images/${SITE.sanityProjectId || 'gojst4dq'}/${SITE.sanityDataset || 'production'}/${id}-${w}x${h}.${ext}`
  return {width: Number(w), height: Number(h), url: (width: number) => `${base}?w=${width}&auto=format&fit=max&q=75`}
}

export const SITE_NAMES: Record<string, string> = {unsplash: 'Unsplash', pexels: 'Pexels', pixabay: 'Pixabay', wikimedia: 'Wikimedia Commons'}
