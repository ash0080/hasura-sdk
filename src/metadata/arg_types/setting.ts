import {EndpointName, EndpointUrl} from '../partial_types/syntax_patch_types'
import {AllowedRESTMethods, RestEndpointDefinition, RoleName} from '../partial_types/syntax_types'

export const SettingQueryTypes = [
	'set_graphql_introspection_options',
	'create_rest_endpoint',
	'drop_rest_endpoint',
	'add_host_to_tls_allowlist',
	'drop_host_from_tls_allowlist',
	'add_inherited_role',
	'drop_inherited_role',
] as const

export type SettingQueryType = typeof SettingQueryTypes[number]

//HINT: cloud/enterprise version only
export interface SetGraphqlSchemaIntrospectionOptionsArgs {
	disabled_for_roles: RoleName[]
}

export interface CreateRestEndpointArgs {
	name: EndpointName
	url: EndpointUrl
	methods: AllowedRESTMethods[]
	definition: RestEndpointDefinition
	comment?: string
}

export interface DropRestEndpointArgs {
	name: EndpointName
}

export interface AddHostToTlsAllowlistArgs {
	host: string
	suffix?: string //portnumber etc.
	permissions?: ['self-signed']
}

export interface DropHostFromTlsAllowlistArgs {
	host: string
}

export interface AddInheritedRoleArgs {
	role_name: RoleName
	role_set: RoleName[]
}

export interface DropInheritedRoleArgs {
	role_name: RoleName
}
