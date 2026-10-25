import {sourcedFact} from './objects/sourcedFact'
import {measurement} from './objects/measurement'
import {seo} from './objects/seo'
import {specRow} from './objects/specRow'
import {courtMarking} from './objects/courtMarking'
import {webLink} from './objects/webLink'
import {richText} from './objects/portableText'
import {photo} from './objects/photo'
import {source} from './documents/source'
import {sport} from './documents/sport'
import {ruleSet} from './documents/ruleSet'
import {equipmentSpec, ball, net} from './documents/equipment'
import {court} from './documents/court'
import {brand} from './documents/brand'
import {player} from './documents/player'
import {competition} from './documents/competition'
import {governingBody} from './documents/governingBody'
import {directoryListing} from './documents/directoryListing'
import {sponsorPlacement} from './documents/sponsorPlacement'
import {page} from './documents/page'
import {story} from './documents/story'
import {correction} from './documents/correction'

export const schemaTypes = [
  // objects
  sourcedFact, measurement, seo, specRow, courtMarking, webLink, richText, photo,
  // documents
  sport, ruleSet, equipmentSpec, ball, net, court, brand, player, competition,
  governingBody, directoryListing, source, sponsorPlacement, page, story, correction,
]
