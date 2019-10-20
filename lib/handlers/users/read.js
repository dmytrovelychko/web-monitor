const userModel = require('../../models/users');
const log = require('../../util/logger');

module.exports = {
	handler: async ctx => {
		const {
			session: { userId },
		} = ctx;

		try {
			const data = await userModel.getById(userId);

			if (!data) {
				const err = new Error('NO_SUCH_ENTRY');

				err.statusCode = 404;
				err.errorCode = 'NO_SUCH_ENTRY';

				throw err;
			}

			delete data.salt;
			delete data.password;
			delete data.createdAt;
			delete data.updatedAt;

			return {
				statusCode: 200,
				data,
			};
		} catch (err) {
			log.warn(`Failed to read a user with err: ${err}`);

			throw err;
		}
	},
};
