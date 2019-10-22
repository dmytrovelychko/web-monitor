const Joi = require('@hapi/joi');
const uuid = require('uuid');

const log = require('../../util/logger');
const userModel = require('../../models/users');
const tokenModel = require('../../models/tokens');
const { unixTimestampToMysqlDatetime } = require('../../util/datetime');
const { validatePassword } = require('../../util/encryption');

const SESSION_INTERVAL_MS = 60 * 60 * 1000;

function checkPassword(password, passHash, salt) {
	if (!validatePassword(password, passHash, salt)) {
		const authError = new Error('Unauthorized');

		authError.statusCode = 401;
		authError.errorCode = 'UNAUTHORIZED';
		authError.resHeaders = {
			'WWW-Authenticate':
				'Basic realm=Provide proper phone/password combination',
		};

		throw authError;
	}
}

module.exports = {
	schemaValidation: Joi.object({
		phone: Joi.string()
			.max(300, 'utf8')
			.pattern(/^[0-9]+$/)
			.required(),
		password: Joi.string()
			.max(300, 'utf8')
			.required(),
	}),
	handler: async function create(ctx) {
		const { phone, password } = ctx.params;

		try {
			const {
				id: userId,
				password: passHash,
				salt,
			} = await userModel.find({ phone });

			checkPassword(password, passHash, salt);

			const tokenId = uuid();
			const token = {
				id: tokenId,
				userId,
				expire: unixTimestampToMysqlDatetime(
					new Date(Date.now() + SESSION_INTERVAL_MS),
				),
			};

			await tokenModel.create(token);

			return { statusCode: 201, data: token };
		} catch (err) {
			log.warn(`Failed to create a token with err: ${err}`);

			throw err;
		}
	},
};
