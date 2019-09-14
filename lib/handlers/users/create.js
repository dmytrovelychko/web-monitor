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
			await db.create('users', params.phone, params);

			return { statusCode: 201 };
		} catch (err) {
			log.warn(`Failed to create a file with err: ${err}`);

			if (err.code === 'EEXIST') {
				err.statusCode = 409;
				err.errorCode = 'UNIQUENESS_FAIL';
			}

			throw err;
		}
	},
};
