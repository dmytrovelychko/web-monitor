const SimpleRouter = require('./util/simple-api-router');

const { apiResponse, paramValidator } = require('./middleware');
const { create, read, _delete } = require('./handlers/users');

const simpleRouter = new SimpleRouter();

/* @ TODO current CRUD uses 404 status if method not registered and if entity
          not found, we can split this by using errorCode inside api response */
simpleRouter.register('post', '/user', [
	apiResponse,
	paramValidator(create.schemaValidation),
	create.handler,
]);
simpleRouter.register('get', '/user', [
	apiResponse,
	paramValidator(read.schemaValidation),
	read.handler,
]);
simpleRouter.register('delete', '/user', [
	apiResponse,
	paramValidator(_delete.schemaValidation),
	_delete.handler,
]);

module.exports = simpleRouter.router;
