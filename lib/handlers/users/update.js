const Joi = require('@hapi/joi');
const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	schemaValidation: Joi.object({
		firstName: Joi.string().max(300, 'utf8'),
		lastName: Joi.string()
			.max(300, 'utf8')
			.default(''),
		password: Joi.string().max(300, 'utf8'),
		tosAgreement: Joi.boolean().default(false),
	}),
	handler: async ctx => {
		const {
			params,
			state: { currentUserPhone },
		} = ctx;

		try {
			const result = await db.update('users', currentUserPhone, params);

			return { statusCode: result && result.created ? 201 : 200 };
		} catch (err) {
			log.warn(`Failed to update a user with err: ${err}`);

			throw err;
		}
	},
};
