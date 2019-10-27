const Joi = require('@hapi/joi');

const checksModel = require('../../models/checks');
const log = require('../../util/logger');

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
			session: { userId },
		} = ctx;

		try {
			const checks = await checksModel.findAll({ userId });

			if (checks.length >= MAX_CHECKS_COUNT) {
				const err = new Error('Max amount of checks reached');

				err.statusCode = 400;
				err.errorCode = 'MAX_CHECK_COUNT_ERROR';

				throw err;
			}

			const checkId = await checksModel.createUnique({
				...params,
				successCodes: params.successCodes.join(' '),
				userId,
			});

			return { statusCode: 201, data: { checkId } };
		} catch (err) {
			log.warn(`Failed to create a check with err: ${err}`);

			if (err.code === 'ER_DUP_ENTRY') {
				err.statusCode = 409;
				err.errorCode = 'UNIQUENESS_FAIL';
			}

			throw err;
		}
	},
};
