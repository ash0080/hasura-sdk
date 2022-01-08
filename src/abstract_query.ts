import {Headers} from './helper/headers'
import {post} from './helper/client'
import {
  MetadataError,
  SQLError,
} from './helper/error'

import {URL} from 'url'

export interface QueryType<T> {
  type: string,
  args: T
}

export class Query {
  protected constructor(
    protected url: URL,
    protected headers: Headers,
    protected type: string,
    protected args: any,
    protected ErrorType: typeof SQLError | typeof MetadataError,
  ) {
  }

  async run() {
    const resp = await post({
      url: this.url,
      headers: this.headers,
      data: this.toJson(),
    })
    if (resp.statusCode === 200) {
      return resp.body
    } else {
      throw new this.ErrorType(resp.body?.code, resp.body)
    }
  }

  toJson() {
    return {
      type: this.type,
      args: this.args,
    }
  }
}


// const create = (opts: Options, ErrorType: typeof SQLError | typeof MetadataError) => (type, args) => {
//   const url = opts.url
//   const headers = opts.headers
//
//   class MetadataQuery extends Query {
//     constructor(type: string, args: any) {
//       super(new URL(url), headers, type, args, ErrorType)
//     }
//   }
//
//   return new MetadataQuery(type, args)
// }
//
