const permError = new Error('PERMISSION_DENIED');

permError.statusCode = 403;
permError.errorCode = 'PERMISSION_DENIED';

module.exports = async function permissionCheckForParams(ctx, next) {
	if (
		ctx.state.currentUserPhone &&
		ctx.state.currentUserPhone === ctx.params.phone
	) {
		return await next();
	} else {
		throw permError;
	}
};
