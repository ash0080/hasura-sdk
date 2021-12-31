import {SourceName} from '../partial_types/syntax_patch_types'
import {
	Json,
	RemoteSchemaName,
} from '../partial_types/syntax_types.js'

export const MetaQueryTypes = [
	'export_metadata',
	'reload_metadata',
	'clear_metadata',
	'replace_metadata',
	'get_inconsistent_metadata',
	'drop_inconsistent_metadata',
] as const

export type MetaQueryType = typeof MetaQueryTypes[number]

export interface ReplaceMetadataArgs {
	allow_inconsistent_metadata?: boolean
	metadata: Json
}

export interface ReloadMetadataArgs {
	reload_remote_schemas?: boolean | RemoteSchemaName[]
	reload_sources?: boolean | SourceName[]
	recreate_event_triggers?: boolean | SourceName[]
}

