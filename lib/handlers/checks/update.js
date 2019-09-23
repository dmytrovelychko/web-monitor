const Joi = require('@hapi/joi');
const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	schemaValidation: Joi.object({
		checkId: Joi.string()
			.max(300, 'utf8')
			.required(),
		protocol: Joi.string().valid('http', 'https'),
		url: Joi.string().uri({ allowRelative: true }),
		method: Joi.string().valid('get', 'post'),
		successCodes: Joi.array().items(Joi.number().valid(200, 201)),
		timeoutSeconds: Joi.number(),
	}).or('protocol', 'url', 'method', 'successCodes', 'timeoutSeconds'),
	handler: async ctx => {
		const { params } = ctx;

		try {
			const result = await db.update('checks', params.checkId, params);

			return { statusCode: result && result.created ? 201 : 200 };
		} catch (err) {
			log.warn(`Failed to update a check with err: ${err}`);

			throw err;
		}
	},
};
