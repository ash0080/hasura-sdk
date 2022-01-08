import {Query} from '../src/abstract_query'
import tap
  from 'tap'
import sdk
  from '../src'

tap.test('init with pure env', t => {
  t.test('sdk is a funtion', async t => {
    t.type(sdk, 'function')
  })
  t.test('sdk() should return an api structure', async t => {
    const f = sdk()
    t.type(f.metadata, Object, 'metadata is an Object')
    t.type(f.metadata.bulk, 'function', 'bulk is a function')
    t.type(f.metadata.source.add, 'function', 'source.add is a function')
    const {drop} = f.metadata.source
    const addQuery = drop({name: 'test'})
    t.type(addQuery, Query, 'q is a Query')
    t.type(addQuery.toJson, 'function', 'q.toJson() is a function')
    t.type(addQuery.run, 'function', 'q.run() is a function')
  })
  t.end()
})
