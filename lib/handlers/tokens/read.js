const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const db = require('../../db');

module.exports = {
	schemaValidation: Joi.object({
		token: Joi.string()
			.max(300, 'utf8')
			.required(),
	}),
	handler: async function read(ctx) {
		const { token: tokenId } = ctx.params;

		try {
			return { data: await db.read('tokens', tokenId) };
		} catch (err) {
			log.warn(`Failed to read a token with err: ${err}`);

			throw err;
		}
	},
};
