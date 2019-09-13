const SimpleRouter = require('./util/simple-api-router');

const simpleRouter = new SimpleRouter();

simpleRouter.register('get', '/ping', [
	async (ctx, next) => {
		return await next();
	},
	async ctx => {
		return { statusCode: 200, payload: { data: ctx.params } };
	},
]);

module.exports = simpleRouter.router;
