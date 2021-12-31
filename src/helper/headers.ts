import assert from 'assert'

assert.ok(process.env.HASURA_ADMIN_SECRET, 'Admin Secret is required!')
export const admin = {
	'X-Hasura-Role': 'admin',
	'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET,
}
