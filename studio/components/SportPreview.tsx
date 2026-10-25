import {useEffect, useState} from 'react'
import {useClient, type PreviewProps} from 'sanity'

const FAMILIES: Record<string, string> = {
  net: 'Net game',
  wall: 'Wall game',
  heritage: 'Heritage game',
  'beach-and-outdoor': 'Beach and outdoor',
  table: 'Table game',
  other: 'Other',
}

/**
 * Which of a sport's eight tabs have content, counted the way the site does (web/src/lib/sport.ts):
 * a link from either side counts, e.g. a player whose sport is this one.
 */
const TABS_QUERY = `*[_id == $id][0]{
  "rules": defined(ruleSet) || count(*[_type == "ruleSet" && sport._ref == $id]) > 0,
  "equipment": count(coalesce(equipmentSpecs, [])) + count(coalesce(balls, [])) + count(coalesce(nets, [])) > 0 || count(*[_type in ["equipmentSpec", "ball", "net"] && sport._ref == $id]) > 0,
  "courts": count(coalesce(courts, [])) > 0 || count(*[(_type == "court" && sport._ref == $id) || (_type == "venue" && $id in sports[]._ref)]) > 0,
  "brands": count(coalesce(brands, [])) > 0 || count(*[_type == "brand" && $id in sports[]._ref]) > 0,
  "players": count(coalesce(players, [])) > 0 || count(*[_type == "player" && sport._ref == $id]) > 0,
  "competitions": count(coalesce(competitions, [])) > 0 || count(*[_type == "competition" && $id in sports[]._ref]) > 0,
  "organisations": count(coalesce(governingBodies, [])) > 0 || defined(governingBodyFact) || count(*[_type == "governingBody" && $id in sports[]._ref]) > 0
}`

/**
 * Sport list subtitle: "Net game · 6 of 8 tabs", so the list shows which sports still have gaps.
 * The preview's `description` carries the document id in (see sport.ts); it is not displayed.
 */
export function SportPreview(props: PreviewProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const raw = typeof props.description === 'string' ? props.description : ''
  const [family, docId] = raw.split('|')
  const id = docId?.replace(/^drafts\./, '')
  const [tabs, setTabs] = useState<number | null>(null)
  useEffect(() => {
    if (!id) return
    let live = true
    client.fetch<Record<string, boolean> | null>(TABS_QUERY, {id}).then((r) => {
      if (live && r) setTabs(1 + Object.values(r).filter(Boolean).length)
    })
    return () => {
      live = false
    }
  }, [client, id])
  const subtitle = [FAMILIES[family] ?? null, tabs != null ? `${tabs} of 8 tabs` : null].filter(Boolean).join(' · ')
  return props.renderDefault({...props, subtitle, description: undefined})
}
