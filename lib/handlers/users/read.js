const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	handler: async ctx => {
		const {
			state: { currentUserPhone },
		} = ctx;

		try {
			const data = await db.read('users', currentUserPhone);

			delete data.salt;
			delete data.password;

			return {
				statusCode: 200,
				data,
			};
		} catch (err) {
			log.warn(`Failed to read a user with err: ${err}`);

			if (err.code === 'ENOENT') {
				err.statusCode = 404;
				err.errorCode = 'NO_SUCH_ENTRY';
			}

			throw err;
		}
	},
};
