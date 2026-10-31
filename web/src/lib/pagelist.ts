/**
 * Every public page, grouped for the human site map (/site-map/) and llms.txt.
 * Built from the content store, so new Sanity documents appear on the next build.
 */
import type {Doc, Store} from './content'
import {byImportance, nameOf} from './content'
import {urlFor} from './routes'
import {sportView} from './sport'
import {SECTIONS, DIRECTORY_TYPES} from './sections'
import {EQUIPMENT_KINDS} from './equipment'
import {bodyLabel} from './entities'

export type PageLink = {title: string; url: string; note?: string; children?: PageLink[]}
export type PageGroup = {title: string; section?: string; links: PageLink[]}

const byName = (a: Doc, b: Doc) => nameOf(a).localeCompare(nameOf(b))
const link = (store: Store, d: Doc, title = nameOf(d), note?: string): PageLink | null => {
  const url = urlFor(store, d)
  return url ? {title, url, note} : null
}
const compact = (xs: (PageLink | null)[]) => xs.filter(Boolean) as PageLink[]

export function pageGroups(store: Store): PageGroup[] {
  const sports = [...store.ofType('sport')].sort(byImportance)
  const pages = store.ofType('page').sort(byName)
  return [
    {
      title: 'Start here',
      links: [
        {title: 'Home', url: '/'},
        ...Object.values(SECTIONS).map((s) => ({title: s.label, url: s.path})),
        {title: 'Search', url: '/search/'},
      ],
    },
    {
      title: 'Sports',
      section: 'sports',
      // One entry per sport; its other tabs (rules, courts...) hang off it.
      links: sports.map((s) => {
        const tabs = sportView(store, s).tabs
        return {title: s.name, url: tabs[0]?.href ?? `/sports/${s.slug?.current}/`, note: s.summary, children: tabs.slice(1).map((t) => ({title: t.label, url: t.href}))}
      }),
    },
    {
      title: 'Equipment',
      section: 'equipment',
      links: Object.entries(EQUIPMENT_KINDS).map(([k, v]) => ({title: v.title, url: `/equipment/${k}/`})),
    },
    {title: 'Ratings and levels', section: 'players', links: compact(store.ofType('ratingSystem').sort(byName).map((d) => link(store, d)))},
    {title: 'Famous venues', section: 'courts', links: compact(store.ofType('venue').sort(byName).map((d) => link(store, d)))},
    {title: 'Governing bodies', section: 'governing-bodies', links: compact(store.ofType('governingBody').sort(byName).map((d) => link(store, d, bodyLabel(d))))},
    {title: 'Brands', section: 'brands', links: compact(store.ofType('brand').sort(byName).map((d) => link(store, d)))},
    {title: 'Players', section: 'players', links: compact(store.ofType('player').sort(byName).map((d) => link(store, d)))},
    {title: 'Competitions', section: 'competitions', links: compact(store.ofType('competition').sort(byName).map((d) => link(store, d)))},
    {title: 'Directory', section: 'directory', links: [...DIRECTORY_TYPES.map((t) => ({title: t.label, url: `/directory/${t.value}/`})), {title: 'List your business', url: '/directory/submit/'}]},
    {
      title: 'About RacketWiki',
      links: [
        ...compact(pages.map((p) => link(store, p, p.title ?? nameOf(p)))),
        {title: 'Corrections', url: '/corrections/'},
        {title: 'Sponsor a page', url: '/sponsor/'},
        {title: 'All pages', url: '/site-map/'},
      ],
    },
  ].filter((g) => g.links.length > 0)
}
