const Joi = require('@hapi/joi');
const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	schemaValidation: Joi.object({
		firstName: Joi.string(),
		lastName: Joi.string().default(''),
		phone: Joi.string()
			.pattern(/^[0-9]+$/)
			.required(),
		password: Joi.string(),
		tosAgreement: Joi.boolean().default(false),
	}),
	handler: async ctx => {
		const { params } = ctx;

		try {
			const result = await db.update('users', params.phone, params);

			return { statusCode: result && result.created ? 201 : 200 };
		} catch (err) {
			log.warn(`Failed to update a file with err: ${err}`);

			throw err;
		}
	},
};
