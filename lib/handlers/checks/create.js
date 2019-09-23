const Joi = require('@hapi/joi');

const db = require('../../db');
const log = require('../../util/logger');
const { createRandomString } = require('../../util/encryption');

const MAX_CHECKS_COUNT = 5;

module.exports = {
	schemaValidation: Joi.object({
		protocol: Joi.string()
			.valid('http', 'https')
			.required(),
		url: Joi.string()
			.uri({ allowRelative: true })
			.required(),
		method: Joi.string()
			.valid('get', 'post')
			.required(),
		successCodes: Joi.array().items(Joi.number().valid(200, 201)),
		timeoutSeconds: Joi.number(),
	}),
	handler: async ctx => {
		const {
			params,
			state: { currentUserPhone },
		} = ctx;

		try {
			// if user doesn't exist will fail to create check
			const user = await db.read('users', currentUserPhone);

			user.checks = user.checks ? user.checks : [];

			if (user.checks.length >= MAX_CHECKS_COUNT) {
				const err = new Error('Max amount of checks reached');

				err.statusCode = 400;
				err.errorCode = 'MAX_CHECK_COUNT_ERROR';

				throw err;
			}

			const checkId = createRandomString(16);

			await db.create('checks', checkId, {
				checkId,
				...params,
			});

			user.checks.push(checkId);

			await db.update('users', currentUserPhone, user);

			return { statusCode: 201, data: { checkId } };
		} catch (err) {
			log.warn(`Failed to create a check with err: ${err}`);

			throw err;
		}
	},
};
