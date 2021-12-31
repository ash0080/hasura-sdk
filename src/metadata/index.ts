import {
	AddCollectionToAllowlistArgs,
	AddQueryToCollectionArgs,
	CreateCollectionArgs,
	DropCollectionArgs,
	DropCollectionToAllowlistArgs,
	DropQueryFromCollectionArgs,
} from './arg_types/query_collection'
import {
	AddHostToTlsAllowlistArgs,
	AddInheritedRoleArgs,
	CreateRestEndpointArgs,
	DropHostFromTlsAllowlistArgs, DropInheritedRoleArgs,
	DropRestEndpointArgs, SetGraphqlSchemaIntrospectionOptionsArgs,
} from './arg_types/setting'
import {
	ReloadMetadataArgs,
	ReplaceMetadataArgs,
} from './arg_types/metadata'
import {
	CreateCronTriggerArgs,
	CreateEventTriggerArgs,
	CreateScheduledEventArgs,
	DeleteCronTriggerArgs,
	DeleteEventTriggerArgs,
	DeleteScheduledEventArgs,
	InvokeEventTriggerArgs,
	RedeliverEventArgs,
} from './arg_types/trigger'
import {
	CreateActionArgs,
	CreateActionPermissionArgs,
	DropActionArgs,
	DropActionPermissionArgs,
	UpdateActionArgs,
	SetCustomTypesArgs,
} from './arg_types/action'
import {
	AddRemoteSchemaArgs,
	AddRemoteSchemaPermissionsArgs,
	// CreateRemoteRelationshipArgs,
	// UpdateRemoteRelationshipArgs,
	// DeleteRemoteRelationshipArgs,
	DropRemoteSchemaPermissions,
	IntrospectRemoteSchemaArgs,
	ReloadRemoteSchemaArgs,
	RemoveRemoteSchemaArgs,
	UpdateRemoteSchemaArgs,
} from './arg_types/remoteschema'
import {
	// eslint-disable-next-line no-unused-vars
	AddComputedFieldArgs,
	CreateArrayRelationshipArgs,
	CreateDeletePermissionArgs, CreateFunctionPermissionArgs,
	CreateInsertPermissionArgs,
	CreateObjectRelationshipArgs,
	CreateSelectPermissionArgs,
	CreateUpdatePermissionArgs,
	DropComputedFieldArgs,
	DropDeletePermissionArgs, DropFunctionPermissionArgs,
	DropInsertPermissionArgs,
	DropRelationshipArgs,
	DropSelectPermissionArgs,
	DropUpdatePermissionArgs,
	RenameRelationshipArgs,
	SetFunctionCustomizationArgs,
	SetPermissionCommentArgs,
	SetRelationshipCommentArgs,
	SetTableCustomizationArgs,
	SetTableIsEnumArgs,
	TrackFunctionArgs,
	TrackTableArgs,
	UntrackFunctionArgs,
	UntrackTableArgs,
} from './arg_types/table'
import {
	AddSourceArgs,
	DropSourceArgs,
} from './arg_types/source'
import {MetadataBulk, MetadataQuery} from '../queries'

/**
 * add - mostly means you can add multiple
 * create - mostly means you can create only one
 */
export default {
	bulk: (queries: Array<Object>) => new MetadataBulk(queries),
	source: {
		add: (args: AddSourceArgs, driver?: string) => new MetadataQuery('add_source', args, true, driver),
		drop: (args: DropSourceArgs, driver?: string) => new MetadataQuery('drop_source', args, true, driver),
	},
	schemaFunction: {
		track: (args: TrackFunctionArgs, driver?: string) => new MetadataQuery('track_function', args, true, driver),
		untrack: (args: UntrackFunctionArgs, driver?: string) => new MetadataQuery('untrack_function', args, true, driver),
		customize: (args: SetFunctionCustomizationArgs, driver?: string) => new MetadataQuery('set_function_customization', args, true, driver),
		permission: {
			add: (args: CreateFunctionPermissionArgs, driver?: string) => new MetadataQuery('create_function_permission', args, true, driver),
			drop: (args: DropFunctionPermissionArgs, driver?: string) => new MetadataQuery('drop_function_permission', args, true, driver),
		},
	},
	table: {
		track: (args: TrackTableArgs, driver?: string) => new MetadataQuery('track_table', args, true, driver),
		untrack: (args: UntrackTableArgs, driver?: string) => new MetadataQuery('untrack_table', args, true, driver),
		customize: (args: SetTableCustomizationArgs, driver?: string) => new MetadataQuery('set_table_customization', args, true, driver),
		setAsEnum: (args: SetTableIsEnumArgs, driver?: string) => new MetadataQuery('set_table_is_enum', args, true, driver),
		permission: {
			insert: {
				add: (args: CreateInsertPermissionArgs, driver?: string) => new MetadataQuery('create_insert_permission', args, true, driver),
				drop: (args: DropInsertPermissionArgs, driver?: string) => new MetadataQuery('drop_insert_permission', args, true, driver),
			},
			select: {
				add: (args: CreateSelectPermissionArgs, driver?: string) => new MetadataQuery('create_select_permission', args, true, driver),
				drop: (args: DropSelectPermissionArgs, driver?: string) => new MetadataQuery('drop_select_permission', args, true, driver),
			},
			update: {
				add: (args: CreateUpdatePermissionArgs, driver?: string) => new MetadataQuery('create_update_permission', args, true, driver),
				drop: (args: DropUpdatePermissionArgs, driver?: string) => new MetadataQuery('drop_update_permission', args, true, driver),
			},
			delete: {
				add: (args: CreateDeletePermissionArgs, driver?: string) => new MetadataQuery('create_delete_permission', args, true, driver),
				drop: (args: DropDeletePermissionArgs, driver?: string) => new MetadataQuery('drop_delete_permission', args, true, driver),
			},
			comment: (args: SetPermissionCommentArgs, driver?: string) => new MetadataQuery('set_permission_comment', args, true, driver),
		},
		relationship: {
			addObjectRL: (args: CreateObjectRelationshipArgs, driver?: string) => new MetadataQuery('create_object_relationship', args, true, driver),
			addArrayRL: (args: CreateArrayRelationshipArgs, driver?: string) => new MetadataQuery('create_array_relationship', args, true, driver),
			drop: (args: DropRelationshipArgs, driver?: string) => new MetadataQuery('drop_relationship', args, true, driver),
			rename: (args: RenameRelationshipArgs, driver?: string) => new MetadataQuery('rename_relationship', args, true, driver),
			comment: (args: SetRelationshipCommentArgs, driver?: string) => new MetadataQuery('set_relationship_comment', args, true, driver),
		},
		computedField: {
			add: (args: AddComputedFieldArgs, driver?: string) => new MetadataQuery('add_computed_field', args, true, driver),
			drop: (args: DropComputedFieldArgs, driver?: string) => new MetadataQuery('drop_computed_field', args, true, driver),
		},
	},
	action: {
		setCustomTypes: (args: SetCustomTypesArgs) => new MetadataQuery('set_custom_types', args),
		add: (args: CreateActionArgs) => new MetadataQuery('create_action', args),
		drop: (args: DropActionArgs) => new MetadataQuery('drop_action', args),
		update: (args: UpdateActionArgs) => new MetadataQuery('update_action', args),
		permission: {
			add: (args: CreateActionPermissionArgs) => new MetadataQuery('create_action_permission', args),
			drop: (args: DropActionPermissionArgs) => new MetadataQuery('drop_action_permission', args),
		},
	},
	remoteSchema: {
		add: (args: AddRemoteSchemaArgs) => new MetadataQuery('add_remote_schema', args),
		update: (args: UpdateRemoteSchemaArgs) => new MetadataQuery('update_remote_schema', args),
		drop: (args: RemoveRemoteSchemaArgs) => new MetadataQuery('remove_remote_schema', args),
		reload: (args: ReloadRemoteSchemaArgs) => new MetadataQuery('reload_remote_schema', args),
		introspect: (args: IntrospectRemoteSchemaArgs) => new MetadataQuery('introspect_remote_schema', args),
		permission: {
			add: (args: AddRemoteSchemaPermissionsArgs) => new MetadataQuery('add_remote_schema_permissions', args),
			drop: (args: DropRemoteSchemaPermissions) => new MetadataQuery('drop_remote_schema_permissions', args),
		},
		// relation: {
		// 	add: (args: CreateRemoteRelationshipArgs) => new MetadataQuery('create_remote_relationship', args),
		// 	update: (args: UpdateRemoteRelationshipArgs) => new MetadataQuery('update_remote_relationship', args),
		// 	delete: (args: DeleteRemoteRelationshipArgs) => new MetadataQuery('delete_remote_relationship', args),
		// },
	},
	trigger: {
		event: {
			add: (args: CreateEventTriggerArgs, driver?: string) => new MetadataQuery('create_event_trigger', args, true, driver),
			redeliver: (args: RedeliverEventArgs, driver?: string) => new MetadataQuery('redeliver_event', args, true, driver),
			// HINT:invoke a event trigger manually is not supported
			invoke: (args: InvokeEventTriggerArgs, driver?: string) => new MetadataQuery('invoke_event_trigger', args, true, driver),
			drop: (args: DeleteEventTriggerArgs, driver?: string) => new MetadataQuery('delete_event_trigger', args, true, driver),
		},
		cron: {
			add: (args: CreateCronTriggerArgs) => new MetadataQuery('create_cron_trigger', args),
			drop: (args: DeleteCronTriggerArgs) => new MetadataQuery('delete_cron_trigger', args),
		},
		schedule: {
			add: (args: CreateScheduledEventArgs) => new MetadataQuery('create_scheduled_event', args),
			drop: (args: DeleteScheduledEventArgs) => new MetadataQuery('delete_scheduled_event', args),
		},
	},
	metadata: {
		export: () => new MetadataQuery('export_metadata', {}),
		replace: (args: ReplaceMetadataArgs) => new MetadataQuery('replace_metadata', args),
		reload: (args: ReloadMetadataArgs) => new MetadataQuery('reload_metadata', args),
		clear: () => new MetadataQuery('clear_metadata', {}),
		inconsistent: {
			get: () => new MetadataQuery('get_inconsistent_metadata', {}),
			drop: () => new MetadataQuery('drop_inconsistent_metadata', {}),
		},
		// TODO: test_webhook_transform
		// https://hasura.io/docs/latest/graphql/core/api-reference/metadata-api/manage-metadata.html#test-webhook-transform
	},
	rest: {
		createCollection: (args: CreateCollectionArgs) => new MetadataQuery('create_query_collection', args),
		dropCollection: (args: DropCollectionArgs) => new MetadataQuery('drop_query_collection', args),
		addQueryToCollection: (args: AddQueryToCollectionArgs) => new MetadataQuery('add_query_to_collection', args),
		dropQueryFromCollection: (args: DropQueryFromCollectionArgs) => new MetadataQuery('drop_query_from_collection', args),
		addCollectionToAllowlist: (args: AddCollectionToAllowlistArgs) => new MetadataQuery('add_collection_to_allowlist', args),
		dropCollectionFromAllowlist: (args: DropCollectionToAllowlistArgs) => new MetadataQuery('drop_collection_from_allowlist', args),
		createRestEndpoint: (args: CreateRestEndpointArgs) => new MetadataQuery('create_rest_endpoint', args),
		dropRestEndpoint: (args: DropRestEndpointArgs) => new MetadataQuery('drop_rest_endpoint', args),
	},
	setting: {
		// HINT: Only works on cloud/Enterprise version
		GraphQL: {
			setIntrospection: (args: SetGraphqlSchemaIntrospectionOptionsArgs) => new MetadataQuery('set_graphql_introspection_options', args),
		},
		TLSallowList: {
			addHost: (args: AddHostToTlsAllowlistArgs) => new MetadataQuery('add_host_to_tls_allowlist', args),
			dropHost: (args: DropHostFromTlsAllowlistArgs) => new MetadataQuery('drop_host_from_tls_allowlist', args),
		},
		InheritedRole: {
			add: (args: AddInheritedRoleArgs) => new MetadataQuery('add_inherited_role', args),
			drop: (args: DropInheritedRoleArgs) => new MetadataQuery('drop_inherited_role', args),
		},
	},
}
