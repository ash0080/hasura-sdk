import {
	CronExpression,
	SourceName,
	Timestamp,
	UUID,
} from '../partial_types/syntax_patch_types.js'
import {
	Json,
	OperationSpec,
	QualifiedTable,
	RequestTransform, RetryConf,
	RetryConfST,
	ServerHeader,
	TriggerName,
	WebhookURL,
} from '../partial_types/syntax_types'

export const TriggerQueryTypes = [
	'create_event_trigger',
	'delete_event_trigger',
	'redeliver_event',
	'invoke_event_trigger',
	'create_cron_trigger',
	'delete_cron_trigger',
	'create_scheduled_event',
	'delete_scheduled_event',
] as const

export type TriggerQueryType = typeof TriggerQueryTypes[number]

// export type MetadataQueries = Record<Driver, Record<MetadataQueryType, string>>


export interface CreateEventTriggerArgs {
	name: TriggerName
	table: QualifiedTable
	source?: string
	webhook?: string
	webhook_from_env?: string
	insert?: OperationSpec
	update?: OperationSpec
	delete?: OperationSpec
	headers?: ServerHeader[]
	retry_conf?: RetryConf
	replace?: boolean
	enable_manual?: boolean
	request_transform?: RequestTransform
}

export interface DeleteEventTriggerArgs {
	name: TriggerName
	source?: SourceName
}

export interface RedeliverEventArgs {
	event_id: UUID
}

export interface InvokeEventTriggerArgs {
	name: TriggerName
	payload: Json
	source?: SourceName
}

export interface CreateCronTriggerArgs {
	name: TriggerName
	webhook: WebhookURL
	schedule: CronExpression
	payload?: Json
	headers?: ServerHeader[]
	retry_conf?: RetryConfST
	include_in_metadata?: boolean
	comment?: string
	replace?: boolean
	source?: SourceName
}

export interface DeleteCronTriggerArgs {
	name: TriggerName
}


export interface CreateScheduledEventArgs {
	webhook: WebhookURL
	schedule_at: Timestamp
	payload?: Json
	headers?: ServerHeader[]
	retry_conf?: RetryConfST
	comment?: string
	source?: SourceName
}

export interface DeleteScheduledEventArgs {
	type: 'one_off' | 'cron'
	event_id: UUID
}
