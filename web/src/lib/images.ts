/** Sanity image URLs, built from the asset id (image-<id>-<w>x<h>-<ext>) without an extra client. */
import {SITE} from '../site.config'

export type PhotoDoc = {image?: {asset?: {_ref?: string}; hotspot?: {x?: number; y?: number}}; alt?: string; photographer?: string; photographerUrl?: string; site?: string; sourceUrl?: string; licence?: string}

/**
 * How a photo is cropped to fit its frame, in this order:
 * 1. the hotspot an editor set in the Studio;
 * 2. for people, a point in the upper third (where the face usually is);
 * 3. otherwise the centre. (Sanity's automatic "entropy" crop was tried and lost the subject too often.)
 * Cropping happens on the image CDN, so the browser gets exactly the frame it shows.
 */
export type PhotoFocus = 'auto' | 'person'

export function photoAsset(p?: PhotoDoc | null, ratio?: number, focus: PhotoFocus = 'auto') {
  const ref = p?.image?.asset?._ref
  const m = ref?.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/)
  if (!m) return null
  const [, id, w, h, ext] = m
  const base = `https://cdn.sanity.io/images/${SITE.sanityProjectId || 'gojst4dq'}/${SITE.sanityDataset || 'production'}/${id}-${w}x${h}.${ext}`
  const width = Number(w)
  const height = Number(h)
  const hs = p?.image?.hotspot
  const crop =
    hs?.x != null && hs?.y != null
      ? `&crop=focalpoint&fp-x=${hs.x.toFixed(3)}&fp-y=${hs.y.toFixed(3)}`
      : focus === 'person'
        ? '&crop=focalpoint&fp-x=0.5&fp-y=0.3'
        : '&crop=center'
  const hFor = (cw: number) => Math.round(cw / ratio!)
  return {
    width,
    // Height of the frame as delivered (the cropped shape when a ratio is given).
    height: ratio ? hFor(width) : height,
    url: (cw: number) => (ratio ? `${base}?w=${cw}&h=${hFor(cw)}&fit=crop${crop}&auto=format&q=75` : `${base}?w=${cw}&auto=format&fit=max&q=75`),
  }
}

export const SITE_NAMES: Record<string, string> = {unsplash: 'Unsplash', pexels: 'Pexels', pixabay: 'Pixabay', wikimedia: 'Wikimedia Commons'}
