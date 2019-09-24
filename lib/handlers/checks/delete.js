const Joi = require('@hapi/joi');

const log = require('../../util/logger');
const db = require('../../db');

module.exports = {
	schemaValidation: Joi.object({
		checkId: Joi.string()
			.max(300, 'utf8')
			.required(),
	}),
	handler: async function _delete(ctx) {
		const {
			params: { checkId },
			state: { currentUserPhone },
		} = ctx;

		try {
			await db.rm('checks', checkId);

			const user = await db.read('users', currentUserPhone);

			if (user.checks) {
				user.checks = user.checks.filter(c => c !== checkId);

				await db.update('users', currentUserPhone, user);
			}
		} catch (err) {
			log.warn(`Failed to delete a check with err: ${err}`);

			throw err;
		}
	},
};
