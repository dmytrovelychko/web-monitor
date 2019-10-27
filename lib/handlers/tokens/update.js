const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const tokenModel = require('../../models/tokens');
const { jsIntToMysqlDatetime } = require('../../util/datetime');

const TOKEN_EXTENTION_TIME = 30 * 60 * 1000;
const TOKEN_EXTENTION_WINDOW = 2 * 60 * 1000;

function checkExtendability(expireInt) {
	if (Date.now() > expireInt + TOKEN_EXTENTION_WINDOW) {
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
			const { expire } = await tokenModel.getById(tokenId);

			checkExtendability(expire.getTime());

			const expireExtended = new Date(
				expire.getTime() + TOKEN_EXTENTION_TIME,
			);

			await tokenModel.updateById(tokenId, {
				expire: jsIntToMysqlDatetime(expireExtended),
			});

			return { data: { token: tokenId, expire: expireExtended } };
		} catch (err) {
			log.warn(`Failed to update a token with err: ${err}`);

			throw err;
		}
	},
};
