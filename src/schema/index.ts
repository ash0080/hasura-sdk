import {SourceName} from '../metadata/partial_types/syntax_patch_types'
import {QueryType, SchemaBulk, SchemaQuery} from '../queries'

export type SchemaQueryType = 'run_sql'

export interface RunSQLArgs {
	sql: string
	source?: SourceName
	cascade?: boolean
	check_metadata_consistency?: boolean
	read_only?: boolean
}

export default {
	sql: (args: RunSQLArgs) => new SchemaQuery('run_sql', args),
	bulk: (args: Array<QueryType<RunSQLArgs>>) => new SchemaBulk(args),
}
