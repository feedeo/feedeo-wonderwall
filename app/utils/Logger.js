/*
 * Copyright (C) 2016, Feedeo AB. All rights reserved.
 */

const ENVIRONMENT = process.env.FEEDEO_ENVIRONMENT || 'local'
const VERSION = process.env.FEEDEO_VERSION
const VERSION_COMMIT = process.env.FEEDEO_VERSION_COMMIT
const LOG_LEVEL = process.env.FEEDEO_LOG_LEVEL || 'info'

const ROLLBAR_TOKEN = 'd18efb2bb7f5414c85cddc783d08f49f'

const util = require('util')

const moment = require('moment')
const winston = require('winston')

const timeFormat = function () {
	return moment().format('YYYY-MM-DDTHH:mm:ss,SSSZ')
}

const transports = []

transports.push(new winston.transports.Console({
	level: LOG_LEVEL,
	json: false,
	colorize: true,
	timestamp: timeFormat,
	handleExceptions: true,
	humanReadableUnhandledException: true
}))

switch (ENVIRONMENT) {
	case 'development':
	case 'production':

		const rollbar = require('rollbar')
		rollbar.init(ROLLBAR_TOKEN, {
			environment: ENVIRONMENT,
			branch: VERSION,
			codeVersion: VERSION_COMMIT
		})

		const RollbarLogger = function (options) {
			this.name = 'rollbar'
			this.level = options && options.level || 'error'
			this.handleExceptions = true
			this.humanReadableUnhandledException = true
		}

		util.inherits(RollbarLogger, winston.Transport)

		RollbarLogger.prototype.log = function (level, msg, meta, callback) {
			if (level === 'error') {
				let error
				let payload = { level }
				if (msg !== '' && meta) {
					error = new Error()
					error.stack = msg

					if (msg.indexOf('\n') > -1) {
						error.message = msg.substring(7, msg.indexOf('\n'))
					}

					payload.session = meta
				} else {
					error = meta
				}

				rollbar.handleErrorWithPayloadData(error, payload, function (error) {
					if (error) {
						return callback(error)
					} else {
						return callback(null, true)
					}
				})
			}
		}

		transports.push(new RollbarLogger())

		break

	default:
}

const Logger = new winston.Logger({
	transports: transports,
	exitOnError: false
})

module.exports = Logger

module.exports.stream = {
	'write': function (message) {
		Logger.info(message)
	}
}