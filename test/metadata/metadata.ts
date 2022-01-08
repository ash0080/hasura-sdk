import {MetadataError} from '../../src/helper/error'
import tap from 'tap'
import {metadata as h} from '../helper/sdk'
import log from '../helper/log'

tap.test('metadata', t => {
	let exportedMetadata = {}
	t.test('export metadata', async t => {
		const exportMetadata = h.metadata.export()
		try {
			const resp = await exportMetadata.run()
			log.info(resp.sources)
			t.equal(resp.sources?.[0].name, 'default')
			exportedMetadata = resp
		} catch (err) {
			t.type(err, MetadataError)
			t.fail()
		}
	})

	t.test('reload metadata', async t => {
		const reloadMetadata = h.metadata.reload({
			reload_remote_schemas: true,
			reload_sources: true,
			recreate_event_triggers: true,
		})
		try {
			const resp = await reloadMetadata.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			t.fail()
		}
	})

	t.test('clear metadata', async t => {
		const clearMetadata = h.metadata.clear()
		try {
			const resp = await clearMetadata.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			t.fail()
		}
	})


	t.test('replace metadata', async t => {
		const replaceMetadata = h.metadata.replace({
			allow_inconsistent_metadata: true,
			metadata: exportedMetadata,
		})
		try {
			const resp = await replaceMetadata.run()
			t.type(resp.inconsistent_objects, Array)
		} catch (err) {
			t.fail()
		}
	})
	t.end()
})

tap.test('inconsistent metadata', t => {
	t.test('get inconsistent', async t => {
		const getInconsistent = h.metadata.inconsistent.get()
		try {
			const resp = await getInconsistent.run()
			t.type(resp.inconsistent_objects, Array)
			log.info(resp)
		} catch (err) {
			log.error(err)
			t.fail()
		}
	})
	t.test('drop inconsistent', async t => {
		const dropInconsistent = h.metadata.inconsistent.drop()
		try {
			const resp = await dropInconsistent.run()
			t.equal(resp.message, 'success')
		} catch (err) {
			log.error(err)
			t.fail()
		}
	})
	t.end()
})
