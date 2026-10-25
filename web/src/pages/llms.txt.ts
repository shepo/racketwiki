import {getStore} from '../lib/content'
import {llmsTxt} from '../lib/llms'

export async function GET() {
  return new Response(llmsTxt(await getStore()), {headers: {'content-type': 'text/plain; charset=utf-8'}})
}
