export class SQLError extends Error {
	public response: {}
	public timestamp: Date
	constructor(message = 'Unknown SQL Error', response = {}, timestamp = new Date()) {
		super(message)
		this.response = response
		this.timestamp = timestamp
	}
}

export class MetadataError extends Error {
	public response: {}
	public timestamp: Date
	constructor(message = 'Unknown Metadate Error', response = {}, timestamp = new Date()) {
		super(message)
		this.response = response
		this.timestamp = timestamp
	}
}

export class HealthzError extends Error {
	public timestamp: Date
	constructor(message = 'Unknow Healthz Error', timestamp = new Date()) {
		super(message)
		this.timestamp = timestamp
	}
}

export class PGdumpError extends Error {
	public timestamp: Date
	constructor(message = 'Unknow PGdump Error', timestamp = new Date()) {
		super(message)
		this.timestamp = timestamp
	}
}
