const SITE = 'https://racketwiki.org'

export const abs = (path: string) => new URL(path, SITE).toString()

export const siteJsonLd = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#org`,
    name: 'RacketWiki',
    url: `${SITE}/`,
    logo: `${SITE}/favicon.svg`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    name: 'RacketWiki',
    url: `${SITE}/`,
    inLanguage: 'en-GB',
    publisher: {'@id': `${SITE}/#org`},
    potentialAction: {
      '@type': 'SearchAction',
      target: {'@type': 'EntryPoint', urlTemplate: `${SITE}/search/?q={search_term_string}`},
      'query-input': 'required name=search_term_string',
    },
  },
]

export type Crumb = {name: string; path: string}

export const breadcrumbJsonLd = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({'@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path)})),
})
