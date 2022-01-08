import tap
  from 'tap'
import {metadata as h} from '../helper/sdk'
import log
  from '../helper/log'

// HINT: Only works on cloud/Enterprise version
// tap.pass('graphql set introspection', async t => {
// 	const setIntrospection = h.setting.GraphQL.setIntrospection({
// 		disabled_for_roles: ['public', 'guest'],
// 	})
// 	try {
// 		const resp = await setIntrospection.run()
// 		log.info(resp)
// 	} catch (err) {
// 		log.error(err)
// 	}
// })

// HINT: HASURA_GRAPHQL_EXPERIMENTAL_FEATURES: inherited_roles
tap.test('InheritedRole', t => {
  t.test('add inherited role', async t => {
    const addInheritedRole = h.setting.InheritedRole.add({
      role_name: 'guest',
      role_set: ['anonymous'],
    })
    try {
      const resp = await addInheritedRole.run()
      t.equal(resp.message, 'success')
      log.info(resp)
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'not-exists') ||
      t.equal()
    }
  })
  t.test('drop inherited role', async t => {
    const dropInheritedRole = h.setting.InheritedRole.drop({
      role_name: 'guest',
    })
    try {
      const resp = await dropInheritedRole.run()
      t.equal(resp.message, 'success')
      log.info(resp)
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'not-exists')
    }
  })
  t.end()
})


tap.test('TLSallowList', t => {
  t.test('add', async t => {
    const addHostToTLSAllow = h.setting.TLSallowList.addHost({
      host: 'google.com',
    })
    try {
      const resp = await addHostToTLSAllow.run()
      t.equal(resp.message, 'success')
    } catch (err) {
      t.equal(err.response.code, 'already-exists')
    }
  })
  t.test('drop', async t => {
    const dropHostToTLSAllow = h.setting.TLSallowList.dropHost({
      host: 'google.com',
    })
    try {
      const resp = await dropHostToTLSAllow.run()
      t.equal(resp.message, 'success')
    } catch (err) {
      t.equal(err.response?.code, 'not-exists')
      t.fail()
    }
  })
  t.end()
})
