import log from './helper/log'
import {PGdumpError} from '../src/helper/error'
import tap from 'tap'
import {pgdump} from '../src'

tap.test('PGdump', async t => {
	try {
		const resp = await pgdump({
			opts: ["-O", "-x", "--schema-only", "--schema", "public"],
			clean_output: true,
			source: "default"
		})
		log.info(resp)
		t.equal(resp, true)
	} catch (err) {
		log.error(err.response)
		// t.type(err, PGdumpError)
	}
})
