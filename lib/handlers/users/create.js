const Joi = require('@hapi/joi');

const db = require('../../db');
const log = require('../../util/logger');
const { encodePassword, createRandomString } = require('../../util/encryption');

module.exports = {
	// @TODO check that no additional fields allowed
	schemaValidation: Joi.object({
		firstName: Joi.string()
			.max(300, 'utf8')
			.required(),
		lastName: Joi.string()
			.max(300, 'utf8')
			.default(''),
		phone: Joi.string()
			.max(300, 'utf8')
			.pattern(/^[0-9]+$/)
			.required(),
		password: Joi.string()
			.max(300, 'utf8')
			.required(),
		tosAgreement: Joi.boolean().default(false),
	}),
	handler: async ctx => {
		const { params } = ctx;

		try {
			const salt = createRandomString(16);
			const payload = {
				...params,
				salt,
				password: encodePassword(params.password, salt),
			};

			await db.create('users', params.phone, payload);

			return { statusCode: 201 };
		} catch (err) {
			log.warn(`Failed to create a user with err: ${err}`);

			if (err.code === 'EEXIST') {
				err.statusCode = 409;
				err.errorCode = 'UNIQUENESS_FAIL';
			}

			throw err;
		}
	},
};
