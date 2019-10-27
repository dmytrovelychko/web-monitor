const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const checksModel = require('../../models/checks');

module.exports = {
	schemaValidation: Joi.object({
		checkId: Joi.string()
			.max(300, 'utf8')
			.required(),
	}),
	handler: async function _delete(ctx) {
		const {
			params: { checkId },
		} = ctx;

		try {
			await checksModel.deleteById(checkId);
		} catch (err) {
			log.warn(`Failed to delete a check with err: ${err}`);

			throw err;
		}
	},
};
