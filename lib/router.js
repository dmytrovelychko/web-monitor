const SimpleRouter = require('./util/simple-router');

const simpleRouter = new SimpleRouter();

simpleRouter.register('get', '/ping', [
	async () => {
		return { statusCode: 200, payload: { result: 'OK' } };
	},
]);

module.exports = simpleRouter.router;
