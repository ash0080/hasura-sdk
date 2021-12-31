import tap from 'tap'
import h from '../../src/metadata'
import log from '../helper/log'

tap.teardown(async () => {
	//DONE: clean all custom types
	const cleanCustomType = h.action.setCustomTypes({
		input_objects: [],
		objects: [],
		scalars: [],
		enums: [],
	})
	try {
		await cleanCustomType.run()
	} catch (err) {
		log.error('action/customTypes failed to clear')
	}
})

/*HINT: Action is intended to create custom mutations,
   but the current design of custom types is very poor,
   so it is recommended to use remote schema instead
 */
/* TODO: console/src/shared/utils/hasuraCustomTypeUtils.js/parseCustomTypes,
    It seems that a conversion tool exists here to convert typedef to json format
 */
tap.test('add a custom type', async t => {
	const setCustomType = h.action.setCustomTypes({
		input_objects: [
			{
				name: 'PostInput',
				fields: [
					{
						name: 'title',
						type: 'String!',
					},
					{
						name: 'body',
						type: 'String!',
					},
					{
						name: 'userId',
						type: 'Int!',
					},
				],
			},
			{
				name: 'PostId',
				fields: [
					{
						name: 'id',
						type: 'Int!',
					},
				],
			},
		],
		objects: [
			{
				name: 'Post',
				fields: [
					{
						name: 'title',
						type: 'String!',
					},
					{
						name: 'body',
						type: 'String!',
					},
					{
						name: 'userId',
						type: 'Int!',
					},
					{
						name: 'id',
						type: 'Int!',
					},
				],
			},
			{
				name: 'Comment',
				description: null,
				fields: [
					{
						name: 'postId',
						type: 'Int!',
						description: null,
					},
					{
						name: 'id',
						type: 'Int!',
						description: null,
					},
					{
						name: 'name',
						type: 'String',
						description: null,
					},
					{
						name: 'email',
						type: 'String',
						description: null,
					},
					{
						name: 'body',
						type: 'String',
						description: null,
					},
				],
			},
		],
	}).toJson()
	const addAction = h.action.add({
			name: 'getCommentByPostId',
			definition: {
				arguments: [
					{
						name: 'postId',
						type: 'Int!',
					},
				],
				kind: 'synchronous',
				output_type: '[Comment]!',
				handler: 'https://jsonplaceholder.typicode.com',
				type: 'query',
				headers: [],
				timeout: null,
				request_transform: null,
			},
			comment: 'getCommentByPostId',
		},
	).toJson()
	try {
		const resp = await h.bulk([setCustomType, addAction]).run()
		for (let response of resp) {
			t.equal(response.message, 'success')
		}
		log.info(resp, {depth: null})
	} catch (err) {
		console.dir(err.response, {depth: null})
		t.fail()
	}
})

tap.test('update action', async t => {
	const updateAction = h.action.update({
			name: 'getCommentByPostId',
			definition: {
				arguments: [
					{
						name: 'postId',
						type: 'Int!',
					},
				],
				kind: 'synchronous',
				output_type: '[Comment]!',
				handler: 'https://jsonplaceholder.typicode.com',
				type: 'query',
				headers: [],
				timeout: null,
				request_transform: {
					template_engine: 'Kriti',
					method: 'GET',
					url: '{{$base_url}}/comments',
					query_params: {
						postId: '{{$body.input.postId}}',
					},
				},
			},
			comment: 'getCommentByPostId',
		},
	)
	try {
		const resp = await updateAction.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		t.fail()
	}
})

tap.test('add permission', async t => {
	const addPermission = h.action.permission.add({
		action: 'getCommentByPostId',
		role: 'public',
	})
	try {
		const resp = await addPermission.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		log.error(err.response)
		t.equal(err.response?.code, 'already-exists')
	}
})

tap.test('drop permission', async t => {
	const addPermission = h.action.permission.drop({
		action: 'getCommentByPostId',
		role: 'public',
	})
	try {
		const resp = await addPermission.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		log.error(err.response)
		t.equal(err.response?.code, 'not-exists')
	}
})

tap.test('drop action', async t => {
	const dropAction = h.action.drop({
		name: 'getCommentByPostId',
		clear_data: true, // ONLY works when asynchronous = true
	})
	try {
		const resp = await dropAction.run()
		t.equal(resp.message, 'success')
	} catch (err) {
		log.error(err.response)
		t.equal(err.response.code, 'not-exists')
	}
})
