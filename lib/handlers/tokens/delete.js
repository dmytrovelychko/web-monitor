const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const tokenModel = require('../../models/tokens');

module.exports = {
	schemaValidation: Joi.object({
		token: Joi.string()
			.max(300, 'utf8')
			.required(),
	}),
	handler: async function read(ctx) {
		const { token: tokenId } = ctx.params;

		try {
			await tokenModel.deleteById(tokenId);
		} catch (err) {
			log.warn(`Failed to delete a token with err: ${err}`);

			throw err;
		}
	},
};
