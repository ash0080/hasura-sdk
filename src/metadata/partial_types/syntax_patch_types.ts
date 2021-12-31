import {
	InputArgument,
	QualifiedTable,
	RequestTransform,
	ServerHeader,
} from './syntax_types'

export type RoleName = string
export type SourceName = string
export type PGColumn = string
// export type ComputedFieldName = string
// export type RelationshipName = string
export type WebhookURL = string
export type CronExpression = string
export type Timestamp = string
export type UUID = string
export type GraphQLSDL = string
export type RemoteRelationshipName = string
export type EndpointUrl = string
export type EndpointName = string
export type QueryName = string
// export type TriggerName = string
// export type RemoteSchemaName = string
type TableName = string
type ComputedFieldName = string

// interface NameMapping {
// 	[key: string]: string
// }

interface ValueMapping {
	[key: string]: any
}

interface PGCertSettings {
	max_connections?: number
	idle_timeout?: number
	retries?: number
	pool_timeout?: number
	connection_lifetime?: number
}

interface PGConnectionParameters {
	username: string
	password?: string
	database: string
	host: string
	port: number
}

interface FromEnv {
	from_env: string
}

interface PGSourceConnectionInfo {
	database_url: string | FromEnv | PGConnectionParameters
	pool_settings?: string | PGConnectionParameters
	use_prepared_statements?: boolean
	isolation_level?: 'read-committed' | 'repeatable-read' | 'serializable'
	ssl_configuration?: PGCertSettings
}

export interface PGConfiguration {
	connection_info: PGSourceConnectionInfo
	read_replicas?: [PGSourceConnectionInfo]
}

export interface SourceCustomization {
	root_fields?: RootFieldsCustomization
	type_names?: SourceTypeCustomization
}


// interface CustomRootFields {
// 	select?: string
// 	select_by_pk?: string
// 	select_aggregate?: string
// 	insert?: string
// 	insert_one?: string
// 	update?: string
// 	update_by_pk?: string
// 	delete?: string
// 	delete_by_pk?: string
// }


// type  CustomColumnNames = NameMapping


interface CustomFunctionRootFields {
	function?: string
	function_aggregate?: string
}

export interface FunctionConfiguration {
	custom_name?: string
	custom_root_fields?: CustomFunctionRootFields
	session_argument?: string
	exposed_as?: 'mutation' | 'query'
}

// type  ColumnsMapping = NameMapping

// interface ObjRelUsingManualMapping {
// 	remote_table: TableName
// 	column_mapping: ColumnsMapping
// 	insertion_order?: 'before_parent' | 'after_parent'
// }

// type SameTable = string
// type RemoteTable = string | { table: TableName, column: string }

// export interface ObjRelUsing {
// 	foreign_key_constraint_on?: SameTable | RemoteTable
// 	manual_configuration?: ObjRelUsingManualMapping
// }


// interface ArrRelUsingFKeyOn {
// 	table: TableName
// 	column: string
// }
//
// interface ArrRelUsingManualMapping {
// 	remote_table: TableName
// 	column_mapping: ColumnsMapping
// }
//
// export interface ArrRelUsing {
// 	foreign_key_constraint_on?: ArrRelUsingFKeyOn
// 	manual_configuration?: ArrRelUsingManualMapping
// }

//
// export interface ComputedFieldDefinition {
// 	function: FunctionName
// 	table_argument?: string
// 	session_argument?: string
// }


type ColumnPresetsExp = ValueMapping

type BoolExp = AndExp | OrExp | NotExp | ExistsExp | TrueExp | ColumnExp
type AndExp = { '$and': BoolExp }
type OrExp = { '$or': BoolExp }
type NotExp = { '$not': BoolExp }
type ExistsExp = {
	'$exists': {
		'_table': TableName,
		'_where': BoolExp
	}
}
type TrueExp = {}

type Operator = {
	// eslint-disable-next-line no-unused-vars
	[key in OperatorString]?: object | string | number
}
type ColumnExp = {
	[index: string]: Operator
}


type OperatorString = GeneraicOperator | TextOprator | ColumnComparisonOperator | JSONBOperator | PostGISOperator
type GeneraicOperator = '$eq' | '$ne' | '$gt' | '$lt' | '$gte' | '$lte' | '$in' | '$nin'
type TextOprator = '$like' | '$nlike' | '$ilike' | '$nilike' | '$similar' | '$nsimilar' | '$regex' | '$iregex' | '$nregex' | '$niregex'
type ColumnComparisonOperator = '$ceq' | '$cne' | '$cgt' | '$clt' | '$cgte' | '$clte'
type JSONBOperator = '_contains' | '_contained_in' | '_has_key' | '_has_keys_any' | '_has_keys_all'
type PostGISOperator =
	'_st_contains'
	| '_st_crosses'
	| '_st_equals'
	| '_st_3d_intersects'
	| '_st_intersects'
	| '_st_overlaps'
	| '_st_touches'
	| '_st_within'
	| '_st_d_within'
	| '_st_3d_d_within'

// Example: let check:BoolExp = {'$and': [{'$eq': ['_table', 'table1']}, {'$eq': ['_column', 'column1']}]}
// Example: let set = {'_table': 'table1', '_column': 'column1'}
export interface InsertPermission {
	check?: BoolExp
	set?: ColumnPresetsExp
	columns?: [PGColumn] | '*'
	backend_only?: boolean
}


// Hint: All required/non-required rules based on the real request check, not same as official doc or code in console
export interface SelectPermission {
	filter: BoolExp
	columns: [PGColumn] | '*'
	computed_fields?: [ComputedFieldName]
	limit?: number
	allow_aggregations?: boolean
}


export interface UpdatePermission {
	check?: BoolExp
	filter: BoolExp
	columns: [PGColumn] | '*'
	set?: ColumnPresetsExp
}

export interface DeletePermission {
	filter: BoolExp
}

export interface DropPermissionArgs {
	table: TableName | QualifiedTable
	role: RoleName
	source?: SourceName
}

interface SourceTypeCustomization {
	prefix?: string
	suffix?: string
}

interface RootFieldsCustomization extends SourceTypeCustomization {
	namespace?: string
}

export interface RemoteSchemaPermission {
	schema: GraphQLSDL
}


interface InputArguments {
	[InputField: string]: PGColumn;
}

export interface RemoteField {
	[FieldName: string]: {
		arguments: InputArguments;
		field?: RemoteField;
	};
}

// Fix: @override - Rename transform -> request_transform
export interface ActionDefinition {
	arguments?: InputArgument[];
	output_type?: string;
	kind?: 'synchronous' | 'asynchronous';
	headers?: ServerHeader[];
	forward_client_headers?: boolean;
	handler: WebhookURL;
	type?: 'mutation' | 'query';
	request_transform?: RequestTransform;
	timeout?: number;
}
