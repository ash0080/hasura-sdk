import {ActionDefinition} from '../partial_types/syntax_patch_types'
import {
	RoleName,
	RequestTransform,
	ActionName,
	CustomTypes,
} from '../partial_types/syntax_types.js'

export const ActionQueryTypes = [
	'create_action',
	'drop_action',
	'update_action',
	'set_custom_types',
	'create_action_permission',
	'drop_action_permission',
] as const

export type ActionQueryType = typeof ActionQueryTypes[number]

export type SetCustomTypesArgs = CustomTypes

export interface CreateActionArgs {
	name: ActionName,
	definition: ActionDefinition,
	comment?: string,
}

export interface UpdateActionArgs {
	name: ActionName,
	definition: ActionDefinition,
	comment?: string,
	request_transform?: RequestTransform
}

export interface DropActionArgs {
	name: ActionName,
	clear_data?: boolean,
}

export interface CreateActionPermissionArgs {
	action: ActionName,
	role: RoleName,
	comment?: string,
}

export interface DropActionPermissionArgs {
	action: ActionName,
	role: RoleName,
}

