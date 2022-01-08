import {HealthzError} from '../src/helper/error'
import tap
  from 'tap'
import log from './helper/log'
import {healthz} from './helper/sdk'

tap.test('check healthz', async t => {
  try {
    const check = await healthz()
    t.equal(check, true)
  } catch (err) {
    t.type(err, HealthzError)
    t.fail(err)
  }
})
