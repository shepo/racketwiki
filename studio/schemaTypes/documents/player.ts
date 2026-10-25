import {defineField, defineType} from 'sanity'
import {commonFields, groups} from '../common'

export const player = defineType({
  name: 'player',
  type: 'document',
  description: 'A player page at /players/<slug>/, listed on /players/ and on the sport\u2019s Players tab. We list current honours, never rankings.',
  groups,
  fields: [
    defineField({name: 'name', type: 'string', description: 'The page heading and the name in lists.', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'sport', type: 'reference', to: [{type: 'sport'}], description: 'Puts the player on that sport\u2019s Players tab and under it on /players/.', validation: (r) => r.required(), group: 'links'}),
    defineField({name: 'gender', title: 'Tour', type: 'string', options: {list: [{title: 'Men', value: 'men'}, {title: 'Women', value: 'women'}], layout: 'radio'}, description: 'Groups the player under Men\u2019s tour or Women\u2019s tour on the Players tab, and labels the page ("Player · Women"). Empty puts them under Other players.', group: 'content'}),
    defineField({name: 'photo', type: 'photo', description: 'Shown under the heading on the player page (cropped 4:3).', group: 'content'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Answer-first: who they are, in our words. Shown under the heading and used as the Google description.', group: 'content'}),
    defineField({name: 'nationality', type: 'sourcedFact', description: 'Key facts table on the player page, and the Nationality column on the sport\u2019s Players tab.', group: 'content'}),
    defineField({name: 'born', type: 'sourcedFact', description: 'Text, ISO date: "1990-05-02". Key facts table ("Born").', group: 'content'}),
    defineField({name: 'plays', type: 'sourcedFact', description: 'e.g. "Right-handed", "Drive side". Key facts table ("Plays").', group: 'content'}),
    defineField({name: 'ranking', title: 'Ranking (with date)', type: 'sourcedFact', description: 'Editor reference only, never shown: RacketWiki does not publish rankings.', group: 'content'}),
    defineField({name: 'highlights', title: 'Honours', type: 'array', of: [{type: 'sourcedFact'}], description: 'Current honours: titles and championships won, each sourced. One "Honour" row each in the key facts table; the sport\u2019s Players tab shows how many.', group: 'content'}),
    defineField({name: 'competitions', type: 'array', of: [{type: 'reference', to: [{type: 'competition'}]}], description: 'Listed as Competitions on the player page.', group: 'links'}),
    defineField({name: 'brands', title: 'Equipment sponsors', type: 'array', of: [{type: 'reference', to: [{type: 'brand'}]}], description: 'Not shown on the player page; the player is listed under Players on each brand\u2019s page.', group: 'links'}),
    ...commonFields('players'),
  ],
})
