import {getStore} from '../lib/content'
import {llmsFullTxt} from '../lib/llms'

export async function GET() {
  return new Response(llmsFullTxt(await getStore()), {headers: {'content-type': 'text/plain; charset=utf-8'}})
}
