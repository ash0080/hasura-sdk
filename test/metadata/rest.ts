import tap from 'tap'
import {metadata as h} from '../helper/sdk'
import log from '../helper/log'

// TODO: check error match
const createCollection = h.rest.createCollection({
	name: 'allowed-queries',
	definition: {
		queries: [
			{
				name: 'getOneFileById',
				query: 'query MyQuery($id:uuid!) {\n  file_by_pk(id: $id) {\n    id\n    name\n  }\n}',
			},
		],
	},
})

const addCollectionToAllowlist = h.rest.addCollectionToAllowlist({
	collection: 'allowed-queries',
})

const dropQueryFromCollection = h.rest.dropQueryFromCollection({
	collection_name: 'allowed-queries',
	query_name: 'getOneFileById',
})

const addQueryToCollection = h.rest.addQueryToCollection({
	collection_name: 'allowed-queries',
	query_name: 'ttt',
	query: 'query MyQuery($id:uuid!) {\n  file_by_pk(id: $id) {\n    id\n    name\n  }\n}',
})

const createRestEndpoint = h.rest.createRestEndpoint({
	name: 'getOneFileById',
	url: 'file',
	definition: {
		query: {
			query_name: 'getOneFileById',
			collection_name: 'allowed-queries',
		},
	},
	methods: [
		'GET',
	],
})

const dropCollectionFromAllowList = h.rest.dropCollectionFromAllowlist({
	collection: 'allowed-queries',
})

const dropCollection = h.rest.dropCollection({
	collection: 'allowed-queries',
	cascade: true,
})

const dropRestEndpoint = h.rest.dropRestEndpoint({
	name: 'getOneFileById',
})

tap.test('create a rest Endpoint', t => {
	t.test('create collection', async t => {
		try {
			const resp = await createCollection.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'already-exists')
		}
	})
	t.test('add collection to allowlist', async t => {
		try {
			const resp = await addCollectionToAllowlist.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'already-exists')
		}
	})
	t.test('create REST endpoint', async t => {
		try {
			const resp = await createRestEndpoint.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'already-exists')
		}
	})
	t.end()
})

tap.test('edit a Endpoint', t => {
	t.test('drop rest endpoint', async t => {
		try {
			const resp = await dropRestEndpoint.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'not-found')
		}
	})
	t.test('drop query from collection', async t => {
		try {
			const resp = await dropQueryFromCollection.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			throw err
			t.equal(err.response?.code, 'not-found')
		}
	})
	t.test('add query to collection', async t => {
		try {
			const resp = await addQueryToCollection.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			throw err
			t.equal(err.response?.code, 'already-exists')
		}
	})
	const createRestEndpoint = h.rest.createRestEndpoint({
		name: 'getOneFileById',
		url: 'file',
		definition: {
			query: {
				query_name: 'ttt',
				collection_name: 'allowed-queries',
			},
		},
		methods: [
			'GET',
		],
	})
	t.test('create rest endpoint', async t => {
		try {
			const resp = await createRestEndpoint.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			throw err
			t.equal(err.response?.code, 'already-exists')
		}
	})
	t.end()
})

tap.test('clean', t => {
	t.test('drop a Endpoint', async t => {
		try {
			const resp = await dropRestEndpoint.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'not-exists')
		}
	})
	t.test('drop collection from allowlist', async t => {
		try {
			const resp = await dropCollectionFromAllowList.run()
			log.info(resp)
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'not-exists')
		}
	})
	t.test('drop a collection', async t => {
		try {
			const resp = await dropCollection.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.match(err.response?.internal.reason, /not exist/)
		}
	})
	t.end()
})
