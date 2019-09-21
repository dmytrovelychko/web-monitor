const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const db = require('../../db');

const TOKEN_EXTENTION_TIME = 30 * 60 * 1000;
const TOKEN_EXTENTION_WINDOW = 2000;

function checkExtendability(expire) {
	if (
		expire < Date.now() - TOKEN_EXTENTION_WINDOW / 2 ||
		expire > Date.now() + TOKEN_EXTENTION_WINDOW / 2
	) {
		const err = new Error('NOT_EXTENDABLE');

		err.statusCode = 404;

		throw err;
	}
}

module.exports = {
	schemaValidation: Joi.object({
		token: Joi.string()
			.max(300, 'utf8')
			.required(),
		extend: Joi.boolean().default(true),
	}),
	handler: async function update(ctx) {
		const { token: tokenId } = ctx.params;

		try {
			const { expire } = await db.read('tokens', tokenId);

			checkExtendability(expire);

			const expireExtended = expire + TOKEN_EXTENTION_TIME;

			await db.update('tokens', tokenId, { expire: expireExtended });

			return { data: { token: tokenId, expire: expireExtended } };
		} catch (err) {
			log.warn(`Failed to update a token with err: ${err}`);

			throw err;
		}
	},
};
