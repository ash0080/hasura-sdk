import tap from 'tap'
import {metadata as h} from '../helper/sdk'
import log from '../helper/log'

// HINT: create an API from 'https://fakeql.com/' and use the fragil version url
const url = 'https://fakeql.com/fragilegraphql/0719b06cd7996507a1a4e95773b8d2b1'
const name = 'fake'

tap.test('add a remote schema', async t => {
	try {
		const p = h.remoteSchema.add({
			name, definition: {url},
		})
		const resp = await p.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		t.equal(err.response?.code, 'already-exists')
	}
})

tap.test('update a remote schema', async t => {
	try {
		const p = h.remoteSchema.update({
			name, definition: {url, forward_client_headers: true},
		})
		const resp = await p.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		t.fail()
	}
})

tap.test('reload a remote schema', async t => {
	try {
		const p = h.remoteSchema.reload({name})
		const resp = await p.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		log.error(err.response)
		t.fail()
	}
})

tap.test('introspect a remote schema', async t => {
	// HINT: return a schema definition
	try {
		const p = h.remoteSchema.introspect({name})
		const resp = await p.run()
		log.info (resp)
		t.type(resp.data, Object)
	} catch (err) {
		t.fail()
	}
})

/*
HINT: set HASURA_GRAPHQL_ENABLE_REMOTE_SCHEMA_PERMISSIONS: "true" before test,
 Because of the complexity of the schema field definition,
 it is recommended not to use this API, but to operate in the console GUI
 */
tap.test('permission add/drop', t => {
	t.test('add a permission', async t => {
		try {
			const schema = `
		schema{query:Query}
		type Query{user(id: ID!):User}
		type User{id:ID!}
		`
			const p = h.remoteSchema.permission.add({
				remote_schema: name,
				role: 'public',
				definition: {schema},
			})

			const resp = await p.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err)
			t.equal(err.response?.code, 'already-exists')
		}
	})

	t.test('drop a permission', async t => {
		try {
			const p = h.remoteSchema.permission.drop({
				remote_schema: name,
				role: 'public',
			})
			const resp = await p.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'not-exists')
		}
	})
	t.end()
})

/* HINT: For now, there is no implementation for remoteSchema Relationship,
     nor is there one for the cloud version
 */

tap.test('remove a remote schema', async t => {
	try {
		const p = h.remoteSchema.drop({name})
		const resp = await p.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		t.equal(err.response?.code, 'not-exists')
	}
})
