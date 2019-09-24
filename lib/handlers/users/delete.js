const db = require('../../db');
const log = require('../../util/logger');

module.exports = {
	handler: async ctx => {
		const {
			state: { currentUserPhone },
		} = ctx;

		try {
			const user = await db.read('users', currentUserPhone);

			await db.rm('users', currentUserPhone);

			if (Array.isArray(user.checks)) {
				await Promise.all(
					user.checks.map(checkId => db.rm('checks', checkId)),
				);
			}

			return { statusCode: 200 };
		} catch (err) {
			log.warn(`Failed to delete a user with err: ${err}`);

			if (err.code === 'ENOENT') {
				err.statusCode = 404;
				err.errorCode = 'NO_SUCH_ENTRY';
			}

			throw err;
		}
	},
};
