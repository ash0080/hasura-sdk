import assert from 'assert'
import process from 'process'
import {CollectionQueryType} from './metadata/arg_types/query_collection'
import {SettingQueryType} from './metadata/arg_types/setting'
import {MetaQueryType} from './metadata/arg_types/metadata'
import {TriggerQueryType} from './metadata/arg_types/trigger'
import {post} from './helper/client'
import {MetadataError, SQLError} from './helper/error'
import {admin} from './helper/headers'
import {Driver} from './metadata/partial_types/syntax_types'
import {TableQueryType} from './metadata/arg_types/table'
import {ActionQueryType} from './metadata/arg_types/action'
import {RemoteSchemaQueryType} from './metadata/arg_types/remoteschema'
import {SourceQueryType} from './metadata/arg_types/source'
import {RunSQLArgs, SchemaQueryType} from './schema'
import { URL } from 'url'

type MetadataQueryType = SourceQueryType
	| TableQueryType
	| ActionQueryType
	| RemoteSchemaQueryType
	| TriggerQueryType
	| MetaQueryType
	| SettingQueryType
	| CollectionQueryType

export function prefixedType(type: MetadataQueryType, driver?: string) {
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

export interface QueryType<T> {
	type: string,
	args: T
}

abstract class Query {
	protected constructor(
		protected url: URL,
		protected type: string,
		protected args: Object,
		protected ErrorType: typeof SQLError | typeof MetadataError,
	) {
		assert(url, 'url is required')
		assert(type, 'type is required')
		assert(args, 'args is required')
		assert(ErrorType, 'ErrorType is required')
	}

	async run() {
		const resp = await post({
			url: this.url,
			headers: admin,
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

assert.ok(process.env.HASURA_BASE, 'Hasura back-end address is required!')

export class MetadataQuery extends Query {
	constructor(type: MetadataQueryType | 'bulk', args: Object, prefix = false, driver?: string) {
		super(
			new URL(process.env.HASURA_API_METADATA || '/v1/metadata', process.env.HASURA_BASE),
			(prefix && type !== 'bulk') ? prefixedType(type, driver) : type,
			args,
			MetadataError,
		)
	}
}

export class SchemaQuery extends Query {
	constructor(type: SchemaQueryType | 'bulk', args: RunSQLArgs | Array<QueryType<RunSQLArgs>>) {
		super(new URL(process.env.HASURA_API_SCHEMA || '/v2/query', process.env.HASURA_BASE),
			type,
			args,
			SQLError)
	}

	toJson(): QueryType<RunSQLArgs> {
		return super.toJson() as QueryType<RunSQLArgs>
	}
}

export class SchemaBulk extends SchemaQuery {
	constructor(args: Array<QueryType<RunSQLArgs>>) {
		super('bulk', args)
	}
}

export class MetadataBulk extends MetadataQuery {
	constructor(args: Array<Object>) {
		super('bulk', args)
	}
}
