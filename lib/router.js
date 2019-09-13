const SimpleRouter = require('./util/simple-api-router');

const apiResponse = require('./middleware/api-response');

const simpleRouter = new SimpleRouter();

simpleRouter.register('get', '/ping', [
	apiResponse,
	async () => {
		throw new Error('My error');
	},
]);

module.exports = simpleRouter.router;
