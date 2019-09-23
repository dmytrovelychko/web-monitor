const Joi = require('@hapi/joi');

const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	schemaValidation: Joi.object({
		checkId: Joi.string()
			.max(300, 'utf8')
			.required(),
	}),
	handler: async ctx => {
		const {
			params: { checkId },
		} = ctx;

		try {
			const check = await db.read('checks', checkId);

			return { statusCode: 200, data: { ...check } };
		} catch (err) {
			log.warn(`Failed to read a check with err: ${err}`);

			throw err;
		}
	},
};
