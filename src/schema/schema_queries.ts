import {URL} from 'url'
import {SourceName} from '../metadata/partial_types/syntax_patch_types'
import {SQLError} from '../helper/error'
import {QueryType} from '../abstract_query'
// import {
//   RunSQLArgs,
//   SchemaQueryType,
// } from './index'
import {Query} from '../abstract_query'
import {Headers} from '../helper/headers'

export type SchemaQueryType =
  'run_sql'
  | 'bulk'

export interface RunSQLArgs {
  sql: string
  source?: SourceName
  cascade?: boolean
  check_metadata_consistency?: boolean
  read_only?: boolean
}


const queryBuilder: (url: URL, headers: Headers) => { query: (args: RunSQLArgs) => Query; bulk: (args: Array<QueryType<RunSQLArgs>>) => Query } = (url: URL, headers: Headers) => {
  class SchemaQuery extends Query {
    constructor(type: SchemaQueryType, args: RunSQLArgs | Array<QueryType<RunSQLArgs>>) {
      super(
        url,
        headers,
        type,
        args,
        SQLError)
    }

    toJson(): QueryType<RunSQLArgs> {
      return super.toJson() as QueryType<RunSQLArgs>
    }
  }

  class SchemaBulk extends SchemaQuery {
    constructor(args: Array<QueryType<RunSQLArgs>>) {
      super('bulk', args)
    }
  }

  return {
    query: (args: RunSQLArgs) => new SchemaQuery('run_sql', args),
    bulk: (args: Array<QueryType<RunSQLArgs>>) => new SchemaBulk(args),
  }
}

export default queryBuilder
