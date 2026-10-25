import {getStore} from '../lib/content'
import {buildAnswers} from '../lib/answers'

export async function GET() {
  return new Response(JSON.stringify(buildAnswers(await getStore())), {headers: {'content-type': 'application/json'}})
}
