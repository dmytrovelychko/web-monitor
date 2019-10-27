const Joi = require('@hapi/joi');
const log = require('../../util/logger');
const userModel = require('../../models/users');
const { encodePassword, createRandomString } = require('../../util/encryption');

module.exports = {
	schemaValidation: Joi.object({
		firstName: Joi.string().max(255, 'utf8'),
		lastName: Joi.string()
			.max(300, 'utf8')
			.default(''),
		phone: Joi.string()
			.max(255, 'utf8')
			.pattern(/^[0-9]+$/)
			.required(),
		password: Joi.string().max(255, 'utf8'),
	}),
	handler: async ctx => {
		const {
			params: user,
			session: { userId },
		} = ctx;

		if (user.password) {
			const salt = createRandomString(16);

			user.salt = salt;
			user.password = encodePassword(user.password, salt);
		}

		try {
			await userModel.updateById(userId, user);

			return { statusCode: 200 };
		} catch (err) {
			log.warn(`Failed to update a user with err: ${err}`);

			throw err;
		}
	},
};
