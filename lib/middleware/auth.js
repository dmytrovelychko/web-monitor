const tokenModel = require('../models/tokens');
const userModel = require('../models/users');
const log = require('../util/logger');

module.exports = async function(ctx, next) {
	const authError = new Error('Unauthorized');

	authError.statusCode = 401;
	authError.errorCode = 'UNAUTHORIZED';
	authError.resHeaders = {
		'WWW-Authenticate': 'Bearer realm=Provide valid token',
	};

	let tokenId = null;

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

	const token = await tokenModel.getById(tokenId);

	if (!token) {
		log.warn(`Can't verify token with id: ${tokenId}`);

		throw authError;
	}

	const userId = token.userId;

	try {
		await userModel.getById(userId);
	} catch (err) {
		log.warn(`Token of none existed user id: ${userId}`);

		throw authError;
	}

	// eslint-disable-next-line
	ctx.session = { userId };

	if (token.expire && token.expire.getTime() > Date.now()) {
		return await next();
	} else {
		log.warn(`Expired token with id: ${tokenId}`);

		throw authError;
	}
};
