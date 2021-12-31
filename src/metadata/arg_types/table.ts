// Hint: https://github.com/hasura/graphql-engine/blob/master/console/src/metadata/queryUtils.ts

import {
	DeletePermission, DropPermissionArgs,
	FunctionConfiguration,
	InsertPermission,
	SelectPermission,
	SourceName,
	UpdatePermission,
} from '../partial_types/syntax_patch_types'
import {
	TableName,
	TableConfig,
	FunctionName,
	RelationshipName,
	ObjRelUsing,
	ArrRelUsing,
	ComputedFieldName,
	ComputedFieldDefinition,
	RoleName,
} from '../partial_types/syntax_types.js'

export const TableQueryTypes = [
	'track_table',
	'untrack_table',
	'set_table_customization',
	'set_table_is_enum',
	'create_object_relationship',
	'create_array_relationship',
	'drop_relationship',
	'set_relationship_comment',
	'rename_relationship',
	'add_computed_field',
	'drop_computed_field',
	'create_insert_permission',
	'create_select_permission',
	'create_update_permission',
	'create_delete_permission',
	'drop_insert_permission',
	'drop_select_permission',
	'drop_update_permission',
	'drop_delete_permission',
	'track_function',
	'untrack_function',
	'set_permission_comment',
	'create_function_permission',
	'drop_function_permission',
	'set_function_customization',
] as const

export type TableQueryType = typeof TableQueryTypes[number]
// export type MetadataQueries = Record<Driver, Record<MetadataQueryType, string>>

// type MetadataQueryArgs = {
// 	[key: string]: any;
// };

export interface TrackTableArgs {
	table: TableName
	configuration?: TableConfig
	source?: SourceName
}

export interface UntrackTableArgs {
	table: TableName
	cascade?: boolean
	source?: SourceName
}

export interface SetTableCustomizationArgs {
	table: TableName
	configuration?: TableConfig
	source?: SourceName
}

export interface SetTableIsEnumArgs {
	table: TableName
	is_enum: boolean
	source?: SourceName
}

export interface TrackFunctionArgs {
	function: FunctionName
	configuration?: FunctionConfiguration
	source?: SourceName
	comment?: string
}

export type  UntrackFunctionArgs = FunctionName


export interface SetFunctionCustomizationArgs {
	function: FunctionName
	configuration?: FunctionConfiguration
	source?: SourceName
}

//HINT: table.relationship
export interface CreateObjectRelationshipArgs {
	table: TableName
	name: RelationshipName
	using: ObjRelUsing
	comment?: string
	source?: SourceName
}

export interface CreateArrayRelationshipArgs {
	table: TableName
	name: RelationshipName
	using: ArrRelUsing
	comment?: string
	source?: SourceName
}

export interface DropRelationshipArgs {
	table: TableName
	relationship: RelationshipName
	cascade?: boolean
	source?: SourceName
}


export interface RenameRelationshipArgs {
	table: TableName
	name: RelationshipName
	new_name: string
	source?: SourceName
}

export interface SetRelationshipCommentArgs {
	table: TableName
	relationship: RelationshipName
	comment?: string
	source?: SourceName
}

//HINT: table.computed_field
export interface AddComputedFieldArgs {
	table: TableName
	name: ComputedFieldName
	definition: ComputedFieldDefinition
	comment?: string
	source?: SourceName
}

export interface DropComputedFieldArgs {
	table: TableName
	name: ComputedFieldName
	cascade?: boolean
	source?: SourceName
}

export interface CreateFunctionPermissionArgs {
	function: FunctionName
	role: RoleName
	source?: SourceName
}

export interface DropFunctionPermissionArgs {
	function: FunctionName
	role: RoleName
	source?: SourceName
}

// HINT: table.permission
export interface CreateInsertPermissionArgs {
	table: TableName
	role: RoleName
	permission: InsertPermission
	comment?: string
	source?: SourceName
}

export interface CreateSelectPermissionArgs {
	table: TableName
	role: RoleName
	permission: SelectPermission
	comment?: string
	source?: SourceName
}

export interface CreateUpdatePermissionArgs {
	table: TableName
	role: RoleName
	permission: UpdatePermission
	comment?: string
	source?: SourceName
}

export interface CreateDeletePermissionArgs {
	table: TableName
	role: RoleName
	permission: DeletePermission
	comment?: string
	source?: SourceName
}

export type DropInsertPermissionArgs = DropPermissionArgs
export type DropSelectPermissionArgs = DropPermissionArgs
export type DropUpdatePermissionArgs = DropPermissionArgs
export type DropDeletePermissionArgs = DropPermissionArgs

export interface SetPermissionCommentArgs {
	table: TableName
	role: RoleName
	permission: 'select' | 'insert' | 'update' | 'delete'
	comment?: string
	source?: SourceName
}
