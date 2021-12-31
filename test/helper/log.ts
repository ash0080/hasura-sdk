import pino from 'pino'

export default pino({
	enabled: !process.env.NOLOG,
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
})
