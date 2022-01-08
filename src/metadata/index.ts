import {Headers} from '../helper/headers'
import {URL}
  from 'url'
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
  DropHostFromTlsAllowlistArgs,
  DropInheritedRoleArgs,
  DropRestEndpointArgs,
  SetGraphqlSchemaIntrospectionOptionsArgs,
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
  CreateDeletePermissionArgs,
  CreateFunctionPermissionArgs,
  CreateInsertPermissionArgs,
  CreateObjectRelationshipArgs,
  CreateSelectPermissionArgs,
  CreateUpdatePermissionArgs,
  DropComputedFieldArgs,
  DropDeletePermissionArgs,
  DropFunctionPermissionArgs,
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
import queryBuilder
  from './metadata_queries'
import {Query} from '../abstract_query'

/**
 * add - mostly means you can add multiple
 * create - mostly means you can create only one
 */
export interface MetadataSDK {
  bulk: (queries: Array<Record<string, unknown>>) => Query,
  source: {
    add: (args: AddSourceArgs, driver?: string) => Query,
    drop: (args: DropSourceArgs, driver?: string) => Query,
  },
  schemaFunction: {
    track: (args: TrackFunctionArgs, driver?: string) => Query,
    untrack: (args: UntrackFunctionArgs, driver?: string) => Query,
    customize: (args: SetFunctionCustomizationArgs, driver?: string) => Query,
    permission: {
      add: (args: CreateFunctionPermissionArgs, driver?: string) => Query,
      drop: (args: DropFunctionPermissionArgs, driver?: string) => Query,
    },
  },
  table: {
    track: (args: TrackTableArgs, driver?: string) => Query,
    untrack: (args: UntrackTableArgs, driver?: string) => Query,
    customize: (args: SetTableCustomizationArgs, driver?: string) => Query,
    setAsEnum: (args: SetTableIsEnumArgs, driver?: string) => Query,
    permission: {
      insert: {
        add: (args: CreateInsertPermissionArgs, driver?: string) => Query,
        drop: (args: DropInsertPermissionArgs, driver?: string) => Query,
      },
      select: {
        add: (args: CreateSelectPermissionArgs, driver?: string) => Query,
        drop: (args: DropSelectPermissionArgs, driver?: string) => Query,
      },
      update: {
        add: (args: CreateUpdatePermissionArgs, driver?: string) => Query,
        drop: (args: DropUpdatePermissionArgs, driver?: string) => Query,
      },
      delete: {
        add: (args: CreateDeletePermissionArgs, driver?: string) => Query,
        drop: (args: DropDeletePermissionArgs, driver?: string) => Query,
      },
      comment: (args: SetPermissionCommentArgs, driver?: string) => Query,
    },
    relationship: {
      addObjectRL: (args: CreateObjectRelationshipArgs, driver?: string) => Query,
      addArrayRL: (args: CreateArrayRelationshipArgs, driver?: string) => Query,
      drop: (args: DropRelationshipArgs, driver?: string) => Query,
      rename: (args: RenameRelationshipArgs, driver?: string) => Query,
      comment: (args: SetRelationshipCommentArgs, driver?: string) => Query,
    },
    computedField: {
      add: (args: AddComputedFieldArgs, driver?: string) => Query,
      drop: (args: DropComputedFieldArgs, driver?: string) => Query,
    },
  },
  action: {
    setCustomTypes: (args: SetCustomTypesArgs) => Query,
    add: (args: CreateActionArgs) => Query,
    drop: (args: DropActionArgs) => Query,
    update: (args: UpdateActionArgs) => Query,
    permission: {
      add: (args: CreateActionPermissionArgs) => Query,
      drop: (args: DropActionPermissionArgs) => Query,
    },
  },
  remoteSchema: {
    add: (args: AddRemoteSchemaArgs) => Query,
    update: (args: UpdateRemoteSchemaArgs) => Query,
    drop: (args: RemoveRemoteSchemaArgs) => Query,
    reload: (args: ReloadRemoteSchemaArgs) => Query,
    introspect: (args: IntrospectRemoteSchemaArgs) => Query,
    permission: {
      add: (args: AddRemoteSchemaPermissionsArgs) => Query,
      drop: (args: DropRemoteSchemaPermissions) => Query,
    },
    // relation: {
    // 	add: (args: CreateRemoteRelationshipArgs) => Query,
    // 	update: (args: UpdateRemoteRelationshipArgs) => Query,
    // 	delete: (args: DeleteRemoteRelationshipArgs) => Query,
    // },
  },
  trigger: {
    event: {
      add: (args: CreateEventTriggerArgs, driver?: string) => Query,
      redeliver: (args: RedeliverEventArgs, driver?: string) => Query,
      // HINT:invoke a event trigger manually is not supported
      invoke: (args: InvokeEventTriggerArgs, driver?: string) => Query,
      drop: (args: DeleteEventTriggerArgs, driver?: string) => Query,
    },
    cron: {
      add: (args: CreateCronTriggerArgs) => Query,
      drop: (args: DeleteCronTriggerArgs) => Query,
    },
    schedule: {
      add: (args: CreateScheduledEventArgs) => Query,
      drop: (args: DeleteScheduledEventArgs) => Query,
    },
  },
  metadata: {
    export: () => Query,
    replace: (args: ReplaceMetadataArgs) => Query,
    reload: (args: ReloadMetadataArgs) => Query,
    clear: () => Query,
    inconsistent: {
      get: () => Query,
      drop: () => Query,
    },
// TODO: test_webhook_transform
// https://hasura.io/docs/latest/graphql/core/api-reference/metadata-api/manage-metadata.html#test-webhook-transform
  },
  rest: {
    createCollection: (args: CreateCollectionArgs) => Query,
    dropCollection: (args: DropCollectionArgs) => Query,
    addQueryToCollection: (args: AddQueryToCollectionArgs) => Query,
    dropQueryFromCollection: (args: DropQueryFromCollectionArgs) => Query,
    addCollectionToAllowlist: (args: AddCollectionToAllowlistArgs) => Query,
    dropCollectionFromAllowlist: (args: DropCollectionToAllowlistArgs) => Query,
    createRestEndpoint: (args: CreateRestEndpointArgs) => Query,
    dropRestEndpoint: (args: DropRestEndpointArgs) => Query,
  },
  setting: {
    // HINT: Only works on cloud/Enterprise version
    GraphQL: {
      setIntrospection: (args: SetGraphqlSchemaIntrospectionOptionsArgs) => Query,
    },
    TLSallowList: {
      addHost: (args: AddHostToTlsAllowlistArgs) => Query,
      dropHost: (args: DropHostFromTlsAllowlistArgs) => Query,
    },
    InheritedRole: {
      add: (args: AddInheritedRoleArgs) => Query,
      drop: (args: DropInheritedRoleArgs) => Query,
    },
  }
}

export default (url: URL, headers: Headers): MetadataSDK => {
  const {
    bulk,
    query,
  } = queryBuilder(url, headers)
  return {
    bulk: (queries) => bulk(queries),
    source: {
      add: (args, driver?) => query('add_source', args, true, driver),
      drop: (args, driver?) => query('drop_source', args, true, driver),
    },
    schemaFunction: {
      track: (args, driver?) => query('track_function', args, true, driver),
      untrack: (args, driver?) => query('untrack_function', args, true, driver),
      customize: (args, driver?) => query('set_function_customization', args, true, driver),
      permission: {
        add: (args, driver?) => query('create_function_permission', args, true, driver),
        drop: (args, driver?) => query('drop_function_permission', args, true, driver),
      },
    },
    table: {
      track: (args, driver?) => query('track_table', args, true, driver),
      untrack: (args, driver?) => query('untrack_table', args, true, driver),
      customize: (args, driver?) => query('set_table_customization', args, true, driver),
      setAsEnum: (args, driver?) => query('set_table_is_enum', args, true, driver),
      permission: {
        insert: {
          add: (args, driver?) => query('create_insert_permission', args, true, driver),
          drop: (args, driver?) => query('drop_insert_permission', args, true, driver),
        },
        select: {
          add: (args, driver?) => query('create_select_permission', args, true, driver),
          drop: (args, driver?) => query('drop_select_permission', args, true, driver),
        },
        update: {
          add: (args, driver?) => query('create_update_permission', args, true, driver),
          drop: (args, driver?) => query('drop_update_permission', args, true, driver),
        },
        delete: {
          add: (args, driver?) => query('create_delete_permission', args, true, driver),
          drop: (args, driver?) => query('drop_delete_permission', args, true, driver),
        },
        comment: (args, driver?) => query('set_permission_comment', args, true, driver),
      },
      relationship: {
        addObjectRL: (args, driver?) => query('create_object_relationship', args, true, driver),
        addArrayRL: (args, driver?) => query('create_array_relationship', args, true, driver),
        drop: (args, driver?) => query('drop_relationship', args, true, driver),
        rename: (args, driver?) => query('rename_relationship', args, true, driver),
        comment: (args, driver?) => query('set_relationship_comment', args, true, driver),
      },
      computedField: {
        add: (args, driver?) => query('add_computed_field', args, true, driver),
        drop: (args, driver?) => query('drop_computed_field', args, true, driver),
      },
    },
    action: {
      setCustomTypes: (args) => query('set_custom_types', args),
      add: (args) => query('create_action', args),
      drop: (args) => query('drop_action', args),
      update: (args) => query('update_action', args),
      permission: {
        add: (args) => query('create_action_permission', args),
        drop: (args) => query('drop_action_permission', args),
      },
    },
    remoteSchema: {
      add: (args) => query('add_remote_schema', args),
      update: (args) => query('update_remote_schema', args),
      drop: (args) => query('remove_remote_schema', args),
      reload: (args) => query('reload_remote_schema', args),
      introspect: (args) => query('introspect_remote_schema', args),
      permission: {
        add: (args) => query('add_remote_schema_permissions', args),
        drop: (args) => query('drop_remote_schema_permissions', args),
      },
      // relation: {
      // 	add: (args) => query('create_remote_relationship', args),
      // 	update: (args) => query('update_remote_relationship', args),
      // 	delete: (args) => query('delete_remote_relationship', args),
      // },
    },
    trigger: {
      event: {
        add: (args, driver?) => query('create_event_trigger', args, true, driver),
        redeliver: (args, driver?) => query('redeliver_event', args, true, driver),
        // HINT:invoke a event trigger manually is not supported
        invoke: (args, driver?) => query('invoke_event_trigger', args, true, driver),
        drop: (args, driver?) => query('delete_event_trigger', args, true, driver),
      },
      cron: {
        add: (args) => query('create_cron_trigger', args),
        drop: (args) => query('delete_cron_trigger', args),
      },
      schedule: {
        add: (args) => query('create_scheduled_event', args),
        drop: (args) => query('delete_scheduled_event', args),
      },
    },
    metadata: {
      export: () => query('export_metadata', {}),
      replace: (args) => query('replace_metadata', args),
      reload: (args) => query('reload_metadata', args),
      clear: () => query('clear_metadata', {}),
      inconsistent: {
        get: () => query('get_inconsistent_metadata', {}),
        drop: () => query('drop_inconsistent_metadata', {}),
      },
      // TODO: test_webhook_transform
      // https://hasura.io/docs/latest/graphql/core/api-reference/metadata-api/manage-metadata.html#test-webhook-transform
    },
    rest: {
      createCollection: (args) => query('create_query_collection', args),
      dropCollection: (args) => query('drop_query_collection', args),
      addQueryToCollection: (args) => query('add_query_to_collection', args),
      dropQueryFromCollection: (args) => query('drop_query_from_collection', args),
      addCollectionToAllowlist: (args) => query('add_collection_to_allowlist', args),
      dropCollectionFromAllowlist: (args) => query('drop_collection_from_allowlist', args),
      createRestEndpoint: (args) => query('create_rest_endpoint', args),
      dropRestEndpoint: (args) => query('drop_rest_endpoint', args),
    },
    setting: {
      // HINT: Only works on cloud/Enterprise version
      GraphQL: {
        setIntrospection: (args) => query('set_graphql_introspection_options', args),
      },
      TLSallowList: {
        addHost: (args) => query('add_host_to_tls_allowlist', args),
        dropHost: (args) => query('drop_host_from_tls_allowlist', args),
      },
      InheritedRole: {
        add: (args) => query('add_inherited_role', args),
        drop: (args) => query('drop_inherited_role', args),
      },
    },
  }
}

