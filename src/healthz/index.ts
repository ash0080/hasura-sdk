import {get} from '../helper/client'
import assert from 'assert'
import {HealthzError} from '../helper/error'
import {URL} from 'url'

assert.ok(process.env.HASURA_BASE, 'Hasura back-end address is required')

const url = new URL(process.env.HASURA_API_HEALTH || '/healthz',
	process.env.HASURA_BASE)
export default async () => {
	const resp = await get({url})
	if (resp.statusCode === 200 && resp.body === 'OK') return true
	throw new HealthzError(resp.body)
}
