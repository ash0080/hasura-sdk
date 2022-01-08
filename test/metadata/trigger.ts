import tap
  from 'tap'
import {metadata as h} from '../helper/sdk'
import log
  from '../helper/log'

tap.test('event trigger', t => {
  t.test('add a event trigger', async t => {
    const addEventTrigger = h.trigger.event.add({
      name: 'file_insert',
      table: {
        name: 'file',
        schema: 'public',
      },
      webhook: 'https://httpbin.org/post',
      webhook_from_env: null,
      insert: {
        columns: '*',
      },
      update: {
        columns: '*',
      },
      delete: {
        columns: '*',
      },
      enable_manual: false,
      retry_conf: {
        num_retries: 0,
        interval_sec: 10,
        timeout_sec: 60,
      },
      headers: [],
      replace: false,
      request_transform: {
        template_engine: 'Kriti',
        method: 'POST',
        query_params: {
          postId: '1',
        },
        body: '{\n  "table": {\n    "name": {{$body.table.name}},\n    "schema": {{$body.table.schema}}\n  }\n}',
        content_type: 'application/json',
      },
      source: 'default',
    })
    try {
      const resp = await addEventTrigger.run()
      t.equal(resp.message, 'success')
    } catch (err) {
      log.error(err)
      t.equal(err.response?.code, 'already-exists')
    }
  })

  /**
   * HINT: invoke a event trigger manually is not supported
   */
  t.test('invoke a event trigger', async t => {
    const invokeEventTrigger = h.trigger.event.invoke({
      name: 'file_insert',
      payload: {
        file: {},
      },
    })
    try {
      const resp = await invokeEventTrigger.run()
      t.equal(resp.message, 'success')
    } catch (err) {
      t.equal(err.response?.code, 'not-supported')
    }
  })

  /**
   * HINT: resend a event
   */
  t.test('redeliver a event trigger', async t => {
    const redeliverEventTrigger = h.trigger.event.redeliver({
      event_id: '9a2b292a-6276-40dc-ad3c-0900e957551e',
    })
    try {
      const resp = await redeliverEventTrigger.run()
      t.equal(resp.message, 'success')
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'not-exists')
    }
  })

  t.test('drop a event trigger', async t => {
    const dropEvent = h.trigger.event.drop({
      name: 'file_insert',
    })
    try {
      const resp = await dropEvent.run()
      log.info(resp)
      t.equal(resp.message, 'success')
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'not-exists')
    }
  })

  t.end()
})
//
tap.test('cron trigger', t => {
  t.test('add a cron trigger', async t => {
    const createCronTigger = h.trigger.cron.add({
      source: 'default',
      name: 'notify_everyday',
      webhook: 'https://httpbin.org/post',
      schedule: '0 9 * * *',
      payload: {
        message: 'Hello Everybody',
      },
      headers: [],
      retry_conf: {
        num_retries: 0,
        retry_interval_seconds: 10,
        timeout_seconds: 30,
      },
      comment: null,
      include_in_metadata: true,
      replace: false,
    })
    try {
      const resp = await createCronTigger.run()
      log.info(resp)
      t.equal(resp.message, 'success')
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'already-exists')
    }
  })
  t.test('drop a cron trigger', async t => {
    const dropCronTrigger = h.trigger.cron.drop({
      name: 'notify_everyday',
    })
    try {
      const resp = await dropCronTrigger.run()
      t.equal(resp.message, 'success')
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'not-exists')
    }
  })
  t.end()
})

/**
 * HINT: Please notice that, Same schedule trigger can be added ,
 *  Maybe you need to implement a detection process
 */
tap.test('schedule trigger', t => {
  let id = ''
  t.test('add a schedule trigger', async t => {
    const addScheduleTrigger = h.trigger.schedule.add({
      source: 'default',
      webhook: 'https://httpbin.org/post',
      schedule_at: '2099-12-28T07:03:00.000Z',
      headers: [],
      retry_conf: {
        num_retries: 0,
        retry_interval_seconds: 10,
        timeout_seconds: 60,
      },
      payload: '{message: "Hello, My grandson!"}',
      comment: '',
    })
    try {
      const resp = await addScheduleTrigger.run()
      log.info(resp)
      t.equal(resp.message, 'success')
      id = resp.event_id
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'already-exists')
    }
  })
  t.test('drop a schedule trigger', async t => {
    const dropScheduleTrigger = h.trigger.schedule.drop({
      type: 'one_off',
      event_id: id,
    })
    try {
      const resp = await dropScheduleTrigger.run()
      log.info(resp)
      t.equal(resp.message, 'success')
    } catch (err) {
      log.error(err.response)
      t.equal(err.response?.code, 'not-exists')
    }
  })
  t.end()
})
