import process
  from 'process'
import {Headers} from '../helper/headers'
// import {Headers} from '../hasura-auth-js/src'
import {URL} from 'url'
import {
  MetadataError,
  // SQLError,
} from '../helper/error'
import {Query} from '../abstract_query'
import {ActionQueryType} from './arg_types/action'
import {MetaQueryType} from './arg_types/metadata'
import {CollectionQueryType} from './arg_types/query_collection'
import {RemoteSchemaQueryType} from './arg_types/remoteschema'
import {SettingQueryType} from './arg_types/setting'
import {SourceQueryType} from './arg_types/source'
import {TableQueryType} from './arg_types/table'
import {TriggerQueryType} from './arg_types/trigger'
import {Driver} from './partial_types/syntax_types'

type MetadataQueryType =
  SourceQueryType
  | TableQueryType
  | ActionQueryType
  | RemoteSchemaQueryType
  | TriggerQueryType
  | MetaQueryType
  | SettingQueryType
  | CollectionQueryType

function prefixedType(type: MetadataQueryType, driver?: string) {
  let prefix
  const _driver = driver || (process.env.HASURA_DRIVER as Driver) || 'postgre'
  switch (_driver) {
    case 'mysql':
      prefix = 'mysql_'
      break
    case 'mssql':
      prefix = 'mssql_'
      break
    case 'bigquery':
      prefix = 'bigquery_'
      break
    case 'citus':
      prefix = 'citus_'
      break
    case 'postgres':
    default:
      prefix = 'pg_'
  }
  return `${prefix}${type}`
}


const queryBuilder: (url: URL, headers: Headers) =>
  {
    query: (type: (MetadataQueryType | 'bulk'), args: any, prefix?: boolean, driver?: string) => Query;
    bulk: (args: any) => Query
  } = (url: URL, headers: Headers) => {
  class MetadataQuery extends Query {
    constructor(type, args, prefix = false, driver?: string) {
      super(
        url,
        headers,
        (prefix && type !== 'bulk') ? prefixedType(type, driver) : type,
        args,
        MetadataError,
      )
    }
  }

  class MetadataBulk extends MetadataQuery {
    constructor(args) {
      super('bulk', args)
    }
  }

  return {
    query: (type: MetadataQueryType | 'bulk', args: any, prefix?: boolean, driver?: string) => new MetadataQuery(type, args, prefix, driver),
    bulk: (args: any) => new MetadataBulk(args),
  }
}

export default queryBuilder
