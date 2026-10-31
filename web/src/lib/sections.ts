export const SECTIONS = {
  sports: {label: 'Sports', color: '#0a6b4c', path: '/sports/'},
  rules: {label: 'Rules', color: '#1d4ed8', path: '/rules/'},
  equipment: {label: 'Equipment', color: '#9a4a00', path: '/equipment/'},
  courts: {label: 'Courts', color: '#6d28d9', path: '/courts/'},
  brands: {label: 'Brands', color: '#be185d', path: '/brands/'},
  players: {label: 'Players', color: '#0e7490', path: '/players/'},
  competitions: {label: 'Competitions', color: '#4d7c0f', path: '/competitions/'},
  'governing-bodies': {label: 'Governing bodies', color: '#b91c1c', path: '/governing-bodies/'},
  directory: {label: 'Directory', color: '#7a6200', path: '/directory/'},
  sources: {label: 'Sources', color: '#475569', path: '/sources/'},
} as const

export type SectionKey = keyof typeof SECTIONS

export const ROOT_NAV: SectionKey[] = ['sports', 'equipment', 'courts', 'directory']
export const SEARCH_CHIPS: SectionKey[] = ['sports', 'rules', 'equipment', 'courts']
export const SEARCH_MORE: SectionKey[] = ['brands', 'players', 'competitions', 'governing-bodies', 'directory']

export const DIRECTORY_TYPES = [
  {value: 'governing-bodies', label: 'Governing bodies', blurb: 'Federations, national associations and tours.', color: '#b91c1c'},
  {value: 'brands', label: 'Brands', blurb: 'Rackets, paddles, bats, balls, strings and nets.', color: '#be185d'},
  {value: 'equipment-labs', label: 'Equipment labs', blurb: 'Independent measurement and testing of equipment.', color: '#9a4a00'},
  {value: 'stats-and-records', label: 'Stats and records', blurb: 'Results, rankings and historical records.', color: '#0e7490'},
  {value: 'software-and-apps', label: 'Software and apps', blurb: 'Booking, club management, leagues and ranking tools.', color: '#7a6200'},
  {value: 'clubs-and-venues', label: 'Clubs and venues', blurb: 'Where to play, by sport and country.', color: '#7a6200', empty: true},
  {value: 'coaches', label: 'Coaches', blurb: 'Qualified coaches and academies.', color: '#7a6200', empty: true},
  {value: 'retailers', label: 'Retailers', blurb: 'Specialist shops and online stores.', color: '#7a6200', empty: true},
] as const

export const TIERS = [
  {tier: 1, name: 'Tier 1', short: 'Official rulebook or governing body', label: 'Governing bodies and official rulebooks', use: 'Rules, court dimensions and equipment limits.'},
  {tier: 2, name: 'Tier 2', short: 'National body or tour', label: 'National bodies, tours and tournament organisers', use: 'Rankings, results and competition formats.'},
  {tier: 3, name: 'Tier 3', short: 'Manufacturer or test lab', label: 'Manufacturers and recognised test labs', use: 'Product specifications and measured equipment data.'},
  {tier: 4, name: 'Tier 4', short: 'Stats and records body', label: 'Stats and records bodies', use: 'Historical records and statistics.'},
  {tier: 5, name: 'Tier 5', short: 'Press or community', label: 'Reputable press and community', use: 'Context and history, never the only citation for a rule or measurement.'},
] as const
