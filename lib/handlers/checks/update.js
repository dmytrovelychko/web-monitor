const Joi = require('@hapi/joi');

const checkModel = require('../../models/checks');
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
		const { params: check } = ctx;
		const id = check.checkId;

		delete check.checkId;

		if (check.successCodes) {
			check.successCodes = check.successCodes.join(' ');
		}

		try {
			const result = await checkModel.updateById(id, check);

			return { statusCode: result && result.created ? 201 : 200 };
		} catch (err) {
			log.warn(`Failed to update a check with err: ${err}`);

			throw err;
		}
	},
};
