const db = require('../db');
const log = require('../util/logger');

module.exports = async function(ctx, next) {
	let tokenId = null;

	const authError = new Error('Unauthorized');

	authError.statusCode = 401;
	authError.errorCode = 'UNAUTHORIZED';
	authError.resHeaders = {
		'WWW-Authenticate':
			'Baerer realm=Provide proper phone/password combination',
	};

	try {
		tokenId =
			ctx.req.headers.authorization &&
			ctx.req.headers.authorization.split('Bearer ')[1];
	} catch (err) {
		log.warn(`Can't fetch authorization token`);
	}

	if (!tokenId) {
		throw authError;
	}

	let token = {};

	try {
		token = await db.read('tokens', tokenId);
	} catch (err) {
		log.warn(`Can't verify token with id: ${tokenId}`);

		throw authError;
	}

	if (token.expire && token.expire > Date.now()) {
		return await next();
	} else {
		log.warn(`Expired token with id: ${tokenId}`);

		throw authError;
	}
};
