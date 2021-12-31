import {prefixedType} from '../../src/queries'
import tap from 'tap'
import h from '../../src/metadata'

const drivers = [
	'postgres',
	'mysql',
	'mssql',
	'bigquery',
	'citus',
]

tap.test('all api shouled not be empty', t => {
	t.test('source.add', async t => {
		for (let db of drivers) {
			const addSource = h.source.add({
				name: 'test',
				configuration: {
					connection_info: {
						database_url: {
							from_env: 'HASURA_GRAPHQL_DATABASE_URL',
						},
					},
				},
			}, db)
			try {
				const resp = await addSource.run()
			} catch (err) {
				// console.log(db, '  --  ', err?.response?.error)
				t.not(err.response?.error, '$.type')
				t.not(err.response?.error, '$')
			}
		}
	})
	t.test('source.drop', async t => {
		for (let db of drivers) {
			const dropSource = h.source.drop({name: 'test'}, db)
			try {
				const resp = await dropSource.run()
			} catch (err) {
				// console.log(db, '  --  ', err?.response?.error)
				t.not(err.response?.error, '$.type')
				t.not(err.response?.error, '$')
			}
		}
	})
	t.end()
})

const addSource = h.source.add({
	name: 'test',
	configuration: {
		connection_info: {
			database_url: {
				from_env: 'HASURA_GRAPHQL_DATABASE_URL',
			},
		},
	},
})

const dropSource = h.source.drop({name: 'test'})

tap.test('source operations', t => {
	t.test('add', async t => {
		try {
			const resp = await addSource.run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			t.match(err.response?.error, /already exists/)
		}
	})
	t.test('drop', async t => {
		try {
			const resp = await dropSource.run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			t.equal(err.response?.code, 'not-exists')
		}
	})
	t.end()
})

tap.test('bulk', async t => {
	try {
		const resp = await h.bulk([
			addSource.toJson(),
			dropSource.toJson(),
		]).run()
		for (let response of resp) {
			t.equal(response.message, 'success')
		}
	} catch (err) {
		t.fail()
	}
})
