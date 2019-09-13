const Joi = require('@hapi/joi');
const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	schemaValidation: Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().default(''),
		phone: Joi.string()
			.pattern(/^[0-9]+$/)
			.required(),
		password: Joi.string().required(),
		tosAgreement: Joi.boolean().default(false),
	}),
	handler: async ctx => {
		const { params } = ctx;

		try {
			return await db.create('users', params.phone, params);
		} catch (err) {
			log.warn(`Failed to create a file with err: ${err}`);
			// silently accept phone number that is not unique
		}
	},
};
