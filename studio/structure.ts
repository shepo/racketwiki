import type {StructureResolver} from 'sanity/structure'

/**
 * Every place a sourcedFact can live. GROQ has no recursive search, so the
 * "Needs verification" filter is built from this list. Add a path here when a
 * schema gains a new sourcedFact field.
 */
export const UNVERIFIED_FILTER = [
  'origin.unverified',
  'governingBodyFact.unverified',
  'length.unverified',
  'width.unverified',
  'country.unverified',
  'founded.unverified',
  'parentCompany.unverified',
  'nationality.unverified',
  'born.unverified',
  'plays.unverified',
  'ranking.unverified',
  'organiserFact.unverified',
  'format.unverified',
  'frequency.unverified',
  'venue.unverified',
  'headquarters.unverified',
  'members.unverified',
  'nameChange.unverified',
  'city.unverified',
  'opened.unverified',
  'capacity.unverified',
  'surface.unverified',
]
  .map((p) => `${p} == true`)
  .concat([
    'count(specs[fact.unverified == true]) > 0',
    'count(highlights[unverified == true]) > 0',
    'count(markings[offset.unverified == true]) > 0',
    'count(formats[fact.unverified == true]) > 0',
    'count(products[fact.unverified == true]) > 0',
    'count(sections[count(points[unverified == true]) > 0]) > 0',
  ])
  .join(' || ')

const CONTENT_TYPES: [string, string][] = [
  ['sport', 'Sports'],
  ['ruleSet', 'Rules'],
  ['equipmentSpec', 'Equipment: rackets, paddles, bats'],
  ['ball', 'Equipment: balls and shuttles'],
  ['net', 'Equipment: nets'],
  ['court', 'Courts'],
  ['venue', 'Famous venues'],
  ['brand', 'Brands'],
  ['player', 'Players'],
  ['competition', 'Competitions'],
  ['governingBody', 'Governing bodies'],
  ['directoryListing', 'Directory'],
  ['source', 'Sources'],
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('RacketWiki')
    .items([
      S.listItem()
        .title('Needs verification')
        .id('needs-verification')
        .child(
          S.list()
            .title('Needs verification')
            .items([
              S.listItem()
                .title('All documents with unverified facts')
                .child(
                  S.documentList()
                    .title('Unverified facts')
                    .filter(`!(_type in ["sponsorPlacement", "correction"]) && (${UNVERIFIED_FILTER})`)
                    .defaultOrdering([{field: '_type', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Sources: verify domain')
                .child(S.documentList().title('Sources to verify').filter('_type == "source" && status != "researched"')),
              S.listItem()
                .title('Correction reports (open)')
                .child(S.documentList().title('Open corrections').filter('_type == "correction" && status == "open"')),
            ]),
        ),
      S.divider(),
      ...CONTENT_TYPES.map(([type, title]) => S.documentTypeListItem(type).title(title)),
      S.divider(),
      S.documentTypeListItem('story').title('Front page stories'),
      S.documentTypeListItem('page').title('Guides and editorial pages'),
      S.documentTypeListItem('sponsorPlacement').title('Sponsor placements'),
      S.documentTypeListItem('correction').title('Correction reports'),
    ])
