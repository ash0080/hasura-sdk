import {RemoteSchemaPermission} from '../partial_types/syntax_patch_types.js'
import {
	ComputedFieldName,
	PGColumn,
	QualifiedTable, RemoteField,
	RemoteRelationshipName,
	RemoteSchemaDef,
	RemoteSchemaName,
	RoleName,
} from '../partial_types/syntax_types'

export const RemoteSchemaQueryTypes = [
	'add_remote_schema',
	'update_remote_schema',
	'remove_remote_schema',
	'reload_remote_schema',
	'introspect_remote_schema',
	'add_remote_schema_permissions',
	'drop_remote_schema_permissions',
	'create_remote_relationship',
	'update_remote_relationship',
	'delete_remote_relationship',
] as const

export type RemoteSchemaQueryType = typeof RemoteSchemaQueryTypes[number]

// export type MetadataQueries = Record<Driver, Record<MetadataQueryType, string>>


export interface AddRemoteSchemaArgs {
	name: RemoteSchemaName
	definition: RemoteSchemaDef
	comment?: string
}

export type UpdateRemoteSchemaArgs = AddRemoteSchemaArgs

export interface RemoveRemoteSchemaArgs {
	name: RemoteSchemaName
}

export type  ReloadRemoteSchemaArgs = RemoveRemoteSchemaArgs
export type  IntrospectRemoteSchemaArgs = RemoveRemoteSchemaArgs

export interface AddRemoteSchemaPermissionsArgs {
	remote_schema: RemoteSchemaName
	role: RoleName
	definition: RemoteSchemaPermission
	comment?: string
}

export interface DropRemoteSchemaPermissions {
	remote_schema: RemoteSchemaName
	role: RoleName
}

/* HINT: For now, there is no implementation for remoteSchema Relationship,
     nor is there one for the cloud version
 */
export interface CreateRemoteRelationshipArgs {
	name: RemoteRelationshipName
	table: QualifiedTable
	hasura_fields: [PGColumn | ComputedFieldName]
	remote_schema: RemoteSchemaName
	remote_field: RemoteField
}

export type  UpdateRemoteRelationshipArgs = CreateRemoteRelationshipArgs

export interface DeleteRemoteRelationshipArgs {
	table: QualifiedTable
	name: RemoteRelationshipName
}
