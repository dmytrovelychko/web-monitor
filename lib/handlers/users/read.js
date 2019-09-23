const Joi = require('@hapi/joi');
const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	schemaValidation: Joi.object({
		phone: Joi.string()
			.max(300, 'utf8')
			.pattern(/^[0-9]+$/)
			.required(),
	}),
	handler: async ctx => {
		const { params: phone } = ctx;

		try {
			const data = await db.read('users', phone);

			delete data.salt;
			delete data.password;

			return {
				statusCode: 200,
				data,
			};
		} catch (err) {
			log.warn(`Failed to read a user with err: ${err}`);

			if (err.code === 'ENOENT') {
				err.statusCode = 404;
				err.errorCode = 'NO_SUCH_ENTRY';
			}

			throw err;
		}
	},
};
