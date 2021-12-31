import p from 'phin'

export const post = (p as any).defaults({
	method: 'POST', parse: 'json', timeout: 10000,
})

export const get = (p as any).defaults({
	method: 'GET', parse: 'string', timeout: 10000,
})
