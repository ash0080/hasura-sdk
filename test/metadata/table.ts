import tap from 'tap'
import h from '../../src/metadata'
import s from '../../src/schema'
import knex from 'knex'
import log from '../helper/log'

const k = knex({client: 'pg'})
// tap.jobs = 1 // default jobs value is 1 in single test file

tap.teardown(async () => {
	try {
		const resp = await s.sql({
			sql: k.schema.dropSchema('test', true).toString(),
		}).run()
		log.info(resp, {depth: null})
	} catch (error) {
		log.info(error.response, {depth: null})
	}
})

tap.before(async () => {
	try {
		const resp = await s.bulk([
			s.sql({
				sql: k.schema
					.createSchemaIfNotExists('test')
					.withSchema('test')
					.createTableIfNotExists('test1', t => {
						t.increments()
						t.string('first_name')
						t.string('last_name')
						t.timestamps()
					})
					.createTable('test2', t => {
						t.increments('id').primary()
						t.integer('test1_id')
						t.foreign('test1_id').references('id').inTable('test.test1')
							.onDelete('CASCADE')
							.onUpdate('NO ACTION')
						t.timestamps()
					})
					.createTable('test3', t => {
						t.text('value').primary()
					})
					.toString(),
			}).toJson(),
			s.sql({
				sql: k('test3')
					.withSchema('test')
					.insert([
							{value: 'type1'},
							{value: 'type2'},
						],
					)
					.toString(),
			}).toJson(),
		]).run()
		log.info(resp, {depth: null})
	} catch (err) {
		log.info(err.response, {depth: null})
	}
})

const trackATable = (tableName) => h.table.track({table: {schema: 'test', name: tableName}})
const untrackATable = (tableName) => h.table.untrack({table: {schema: 'test', name: tableName}, cascade: true})

tap.test('table', t => {
	t.test('track tables', async t => {
		try {
			const resp = await h.bulk([
				trackATable('test1').toJson(),
				trackATable('test2').toJson(),
				trackATable('test3').toJson(),
			]).run()
			for (let {message} of resp) {
				t.equal(message, 'success')
			}
		} catch (err) {
			log.error(err)
			t.match(err.response?.code, /already-tracked/)
		}
	})
	t.test('set as enum', async t => {
		const setEnum = h.table.setAsEnum({
			table: {schema: 'test', name: 'test3'},
			is_enum: true,
		})
		try {
			const resp = await setEnum.run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			log.error(err)
			t.fail()
		}
	})
	t.test('customize a table', async t => {
		const customize = h.table.customize({
			table: {schema: 'test', name: 'test1'},
			configuration: {
				custom_name: 'test1',
				custom_root_fields: {
					select: 'getAllTest1',
				},
			},
		})
		try {
			const resp = await customize.run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			log.error(err)
			t.fail()
		}
	})
	t.end()
})

tap.test('permission', t => {
	const p = h.table.permission
	t.test(`create a insert permission`, async t => {
		try {
			const resp = await p.insert.add({
				table: {schema: 'test', name: 'test1'}, role: 'public', permission: {check: {}, columns: '*'},
			}).run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.match(err.response?.code, /already-exists/)
		}
	})
	t.test(`create a select permission`, async t => {
		try {
			const resp = await p.select.add({
				table: {schema: 'test', name: 'test1'}, role: 'public', permission: {filter: {}, columns: '*'},
			}).run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.match(err.response?.code, /already-exists/)
		}
	})
	t.test(`create an update permission`, async t => {
		try {
			const resp = await p.update.add({
				table: {schema: 'test', name: 'test1'}, role: 'public', permission: {filter: {}, columns: '*'},
			}).run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.match(err.response?.code, /already-exists/)
		}
	})
	t.test(`create a delete permission`, async t => {
		try {
			const resp = await p.delete.add({
				table: {schema: 'test', name: 'test1'}, role: 'public', permission: {filter: {}},
			}).run()
			t.equal(resp?.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.match(err.response?.code, /already-exists/)
		}
	})
	t.test('commnet', async t => {
		try {
			const resp = await h.table.permission.comment({
				table: {schema: 'test', name: 'test1'},
				role: 'public',
				permission: 'select',
				comment: 'this is a comment',
			}).run()
			log.info(resp)
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
		}
	})

	for (let kind of ['insert', 'select', 'update', 'delete']) {
		t.test(`drop a ${kind} permission`, async t => {
			try {
				const resp = await p[kind].drop({
					table: {schema: 'test', name: 'test1'}, role: 'public',
				}).run()
				t.equal(resp?.message, 'success')
			} catch (err) {
				log.error(err.response, {depth: null})
				t.match(err.response?.error, /not exist/)
			}
		})
	}
	t.end()
})

tap.test('relationship', t => {
	t.test('addObjectRelationship', async t => {
		try {
			const resp = await h.table.relationship.addObjectRL({
				table: {schema: 'test', name: 'test2'},
				name: 'test1',
				using: {
					foreign_key_constraint_on: 'test1_id',
				},
			}).run()
			log.info(resp, {depth: null})
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.equal(err.response?.code, 'already-exists')
		}
	})
	t.test('addArrayRelationship', async t => {
		try {
			const resp = await h.table.relationship.addArrayRL({
				table: {schema: 'test', name: 'test1'}, //current table
				name: 'test2s',  // target table
				using: {
					foreign_key_constraint_on: {
						table: {schema: 'test', name: 'test2'},
						column: 'test1_id',
					},
				},
			}).run()
			log.info(resp, {depth: null})
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.equal(err.response?.code, 'already-exists')
		}
	})
	t.test('drop', async t => {
		try {
			const resp = await h.table.relationship.drop({
				table: {schema: 'test', name: 'test1'},
				relationship: 'test2s',
				cascade: true,
				//HINT: casecade don't drop reverse relationship automatically
			}).run()
			log.info(resp, {depth: null})
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.equal(err.response?.code, 'not-exists')
		}
	})
	t.test('rename', async t => {
		try {
			const resp = await h.table.relationship.rename({
				table: {schema: 'test', name: 'test2'},
				name: 'test1',
				new_name: 'test_1',
			}).run()
			log.info(resp, {depth: null})
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response, {depth: null})
			t.match(err.response?.code, /exists/)
		}
	})
	t.test('commnet', async t => {
		//HINT: relationship comment is useless now. Because it is currently not displayed in the console
		try {
			const resp = await h.table.relationship.comment({
				table: {schema: 'test', name: 'test2'},
				relationship: 'test_1',
				comment: 'This is a commnet',
			}).run()
			log.info(resp, {depth: null})
			t.equal(resp.message, 'success')
		} catch (err) {
			t.fail()
		}
	})
	t.end()
})

/**
 * HINT: There 2 Kind of functions,
 *  one for computed fields ( you can add computed field by this kind )
 *  and one for extending the graphql schema ( you can track/untrack this kind )
 */
const createComputedFieldFunctionSQL = `
CREATE OR REPLACE FUNCTION test.full_name(r test.test1) 
RETURNS text AS $$
  SELECT r.first_name || ' ' || r.last_name
$$ LANGUAGE sql STABLE
`
const createSchemaFunctionSQL = `
CREATE OR REPLACE FUNCTION test.search(search text)
RETURNS SETOF test.test1 AS $$
    SELECT
      *
    FROM
      test.test1
    WHERE
    first_name ilike ('%' || search || '%')
    OR last_name ilike ('%' || search || '%')
$$ LANGUAGE sql STABLE;
`
const dropFnSQL = `
DROP FUNCTION test.full_name, test.search
`
tap.test('schema function', t => {
	t.test('add a schema function', async t => {
		try {
			const resp = await s.sql({sql: createSchemaFunctionSQL}).run()
			log.info(resp)
			t.equal(resp.result_type, 'CommandOk')
		} catch (err) {
			t.fail()
		}
	})
	t.test('track schema function', async t => {
		try {
			const resp = await h.schemaFunction.track({
				function: {schema: 'test', name: 'search'},
			}).run()
			log.info(resp)
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err)
			t.equal(err.response?.code, 'already-tracked')
		}
	})
	// HINT: No GUI for this, So try it yourself!
	t.test('customize schema function', async t => {
		try {
			const resp = await h.schemaFunction.customize({
				function: {schema: 'test', name: 'search'},
				configuration: {
					custom_name: 'search2',
				},
			}).run()
			log.info(resp)
			t.equal(resp.message, 'success')
		} catch (err) {
			t.fail()
			log.error(err)
		}
	})
	/**
	 * HINT: ONLY when HASURA_GRAPHQL_INFER_FUNCTION_PERMISSIONS=false
	 */
	t.test('add a permission', async t => {
		try {
			const addFunctionPermission = h.schemaFunction.permission.add({
				function: {schema: 'test', name: 'search'},
				role: 'public',
			})
			const addTablePermission = h.table.permission.select.add({
				table: {schema: 'test', name: 'test1'},
				role: 'public',
				permission: {
					columns: '*',
					filter: {},
				},
			})
			const resp = await h.bulk([
				addTablePermission.toJson(),
				addFunctionPermission.toJson(),
			]).run()
			log.info(resp)
			for (let {message} of resp) {
				t.equal(message, 'success')
			}
		} catch (err) {
			log.error(err.response)
			if (err.response?.code == 'not-supported' ||
				err.response?.code == 'already-exists')
				t.pass()
		}
	})
	t.test('drop a permission', async t => {
		try {
			const resp = await h.schemaFunction.permission.drop({
				function: {schema: 'test', name: 'search'},
				role: 'public',
			}).run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.equal(err.response?.code, 'not-exists')
		}
	})
	t.test('untrack a function', async t => {
		try {
			const resp = await h.schemaFunction.untrack({schema: 'test', name: 'search'}).run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.fail()
		}
	})
	t.end()
})


tap.test('computed field', t => {
	t.test('add a computed field function', async t => {
		try {
			const resp = await s.sql({sql: createComputedFieldFunctionSQL}).run()
			t.equal(resp.result_type, 'CommandOk')
		} catch (err) {
			t.fail()
		}
	})
	t.test('add a computed field', async t => {
		try {
			const resp = await h.table.computedField.add({
				table: {schema: 'test', name: 'test1'},
				name: 'full_name',
				definition: {function: {schema: 'test', name: 'full_name'}},
			}).run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.fail()
		}
	})
	t.test('drop a computed field', async t => {
		try {
			const resp = await h.table.computedField.drop({
				table: {schema: 'test', name: 'test1'},
				name: 'full_name',
			}).run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err.response)
			t.fail()
		}
	})
	t.test('drop functions', async t => {
		try {
			const resp = await s.sql({sql: dropFnSQL}).run()
			t.equal(resp.result_type, 'CommandOk')
		} catch (err) {
			log.error(err.response)
			t.fail()
		}
	})
	t.end()
})

tap.test('untrack tables', async t => {
	try {
		const resp = await h.bulk([
			untrackATable('test1').toJson(),
			untrackATable('test2').toJson(),
			untrackATable('test3').toJson(),
		]).run()
		for (let {message} of resp) {
			t.equal(message, 'success')
		}
	} catch (err) {
		log.info(err.response, {depth: null})
		t.match(err.response?.code, /already-untracked/)
	}
})
