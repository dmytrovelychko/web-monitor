const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const db = require('../../db');
const {
	validatePassword,
	createRandomString,
} = require('../../util/encryption');

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
			const { password: passHash, salt } = await db.read('users', phone);

			checkPassword(password, passHash, salt);

			const tokenId = createRandomString(16);
			const payload = {
				phone,
				tokenId,
				expire: Date.now() + 60 * 60 * 1000,
			};

			await db.create('tokens', tokenId, payload);

			return { statusCode: 201, data: payload };
		} catch (err) {
			log.warn(`Failed to create a token with err: ${err}`);

			throw err;
		}
	},
};
