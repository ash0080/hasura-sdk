import {Headers} from '../helper/headers'
import {URL}
  from 'url'
import {RunSQLArgs} from './schema_queries'
import {
  QueryType,
} from '../abstract_query'
import queryBuilder
  from './schema_queries'
import {Query} from '../abstract_query'

export interface SchemaSDK {
  sql: (args: RunSQLArgs) => Query,
  bulk: (args: Array<QueryType<RunSQLArgs>>) => Query
}

export default (url: URL, headers: Headers) => {
  const {
    bulk,
    query,
  } = queryBuilder(url, headers)
  return {
    bulk: (args) => bulk(args),
    sql: (args) => query(args),
  }
}
