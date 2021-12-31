import {PGConfiguration, SourceCustomization, SourceName} from '../partial_types/syntax_patch_types.js'

export const SourceQueryTypes = [
	'add_source',
	'drop_source',
	'reload_metadata',
] as const

export type SourceQueryType = typeof SourceQueryTypes[number]

// export type MetadataQueries = Record<Driver, Record<MetadataQueryType, string>>

export interface AddSourceArgs {
	name: SourceName
	configuration: PGConfiguration
	replace_configuration?: boolean
	customization?: SourceCustomization
}

export interface DropSourceArgs {
	name: SourceName
	cascade?: boolean
}

export interface Response {
	statusCode: number
	body: string | { error: string } | { path: string; error: string }
}
