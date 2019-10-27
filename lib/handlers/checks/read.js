const Joi = require('@hapi/joi');

const checksModel = require('../../models/checks');
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
			const check = await checksModel.getById(checkId);

			return {
				statusCode: 200,
				data: {
					id: check.id,
					userId: check.userId,
					protocol: check.protocol,
					url: check.url,
					method: check.method,
					successCodes: check.successCodes,
					timeoutSeconds: check.timeoutSeconds,
				},
			};
		} catch (err) {
			log.warn(`Failed to read a check with err: ${err}`);

			throw err;
		}
	},
};
