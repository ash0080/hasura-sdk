import {
  Headers,
} from '../helper/headers'
import {post} from '../helper/client'
import {PGdumpError} from '../helper/error'
import {URL} from 'url'

export interface PGDumpArgs {
  opts: string[],
  clean_output: boolean,
  source?: string
}

export default (url: URL, headers: Headers) => {
  return async (args: PGDumpArgs): Promise<string> => {
    const resp = await post({
      url,
      parse: 'string',
      headers,
      data: args,
    })
    if (resp.statusCode === 200) return resp.body
    throw new PGdumpError(resp.body)
  }
}
