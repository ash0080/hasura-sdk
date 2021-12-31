import {QueryName} from '../partial_types/syntax_patch_types'
import {
	CollectionName,
	 QueryCollectionEntry,
} from '../partial_types/syntax_types.js'


export const CollectionQueryTypes = [
	'create_query_collection',
	'drop_query_collection',
	'add_query_to_collection',
	'drop_query_from_collection',
	'add_collection_to_allowlist',
	'drop_collection_from_allowlist',
	'replace_metadata',
] as const

export type CollectionQueryType = typeof CollectionQueryTypes[number]

export type CreateCollectionArgs = QueryCollectionEntry
// export interface CreateCollectionArgs {
// 	name: CollectionName
// 	definition: QueryCollection[]
// 	comment?: string
// }

export interface DropCollectionArgs {
	collection: CollectionName
	cascade: boolean
}

export interface AddQueryToCollectionArgs {
	collection_name: CollectionName
	query_name: QueryName
	query: string
}

export interface DropQueryFromCollectionArgs {
	collection_name: CollectionName
	query_name: QueryName
}

export interface AddCollectionToAllowlistArgs {
	collection: CollectionName
}

export interface DropCollectionToAllowlistArgs {
	collection: CollectionName
}
