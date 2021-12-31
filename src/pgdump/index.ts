import {admin} from '../helper/headers'
import {post} from '../helper/client'
import assert from 'assert'
import {PGdumpError} from '../helper/error'
import { URL } from 'url'

assert.ok(process.env.HASURA_BASE, 'Hasura back-end address is required')
const url = new URL(process.env.HASURA_API_PGDUMP || '/v1alpha1/pg_dump',
	process.env.HASURA_BASE)

interface PGDumpArgs {
	opts: string[],
	clean_output: boolean,
	source?: string
}

export default async (args: PGDumpArgs) => {
	const resp = await post({
		url,
		parse: 'string',
		headers: admin,
		data: args,
	})
	if (resp.statusCode === 200) return true
	throw new PGdumpError(resp.body)
}
