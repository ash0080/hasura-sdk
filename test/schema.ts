import tap from 'tap'
import h from '../src/schema'
import {SQLError} from '../src/helper/error'
import knex from 'knex'
import {printTable} from 'console-table-printer'
import log from './helper/log'

const k = knex({client: 'pg'})
const createStorageTable = k.schema
	.withSchema('public')
	.createTableIfNotExists('storage', (t) => {
		t.increments('id').primary()
		t.string('name')
		t.string('type')
		t.string('value')
		t.timestamps()
	})

const createTestTable = k.schema
	.withSchema('public')
	.createTableIfNotExists('test', (t) => {
		t.increments('id').primary()
		t.string('name')
		t.string('type')
		t.string('value')
		t.timestamps()
	})


tap.test('sql expects success or duplicated', async t => {
	const sql = createStorageTable.toString()
	try {
		const resp = await h.sql({
			sql,
			// cascade: true,
			// check_metadata_consistency: true,
		}).run()
		t.equal(resp.result_type, 'CommandOk')
	} catch (err) {
		log.error(err.response, {depth: null})
		t.type(err, SQLError)
		t.match(err.response?.internal?.error?.message, /already exists/)
	}
})

tap.test('bulk expects success or duplicated', t => {
	// HINT: if one operation fails, the follow-up operations will be skiped
	t.test('create 2 schemas', async t => {
		const q = h.bulk([
			h.sql({
				sql: k.schema.createSchema('test1').toString(),
			}).toJson(),
			h.sql({
				sql: k.schema.createSchema('test2').toString(),
			}).toJson(),
		])
		try {
			const resp = await q.run()
			// console.dir(resp, {depth: null})
			for (let {result_type} of resp) {
				t.equal(result_type, 'CommandOk')
			}
		} catch (err) {
			// console.dir(err.response, {depth: null})
			t.match(err.response?.internal?.error?.message, /already exists/)
			t.type(err, SQLError)
		}
	})
	t.test('drop 2 schemas', async t => {
		const q = h.bulk([
			h.sql({
				sql: k.schema.dropSchema('test1').toString(),
			}).toJson(),
			h.sql({
				sql: k.schema.dropSchema('test2').toString(),
			}).toJson(),
		])
		try {
			const resp = await q.run()
			for (let {result_type} of resp) {
				t.equal(result_type, 'CommandOk')
			}
		} catch (err) {
			// t.match(err.response?.internal?.error?.message, /not exist/)
			t.type(err, SQLError)
		}
	})
	t.end()
})
