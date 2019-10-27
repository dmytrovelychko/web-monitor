const userModel = require('../../models/users');
const log = require('../../util/logger');

module.exports = {
	handler: async ctx => {
		const {
			session: { userId },
		} = ctx;

		try {
			await userModel.deleteById(userId);

			return { statusCode: 200 };
		} catch (err) {
			log.warn(`Failed to delete a user with err: ${err}`);
		}
	},
};
