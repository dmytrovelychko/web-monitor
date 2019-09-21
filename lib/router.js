const SimpleRouter = require('./util/simple-api-router');

const { apiResponse, paramValidator } = require('./middleware');
const users = require('./handlers/users');
const tokens = require('./handlers/tokens');

const simpleRouter = new SimpleRouter();

/* @ TODO current CRUD uses 404 status if method not registered and if entity
          not found, we can split this by using errorCode inside api response */
simpleRouter.register('post', '/users', [
	apiResponse,
	paramValidator(users.create.schemaValidation),
	users.create.handler,
]);
// need auth
simpleRouter.register('put', '/users', [
	apiResponse,
	paramValidator(users.update.schemaValidation),
	users.update.handler,
]);
// need auth
simpleRouter.register('get', '/users', [
	apiResponse,
	paramValidator(users.read.schemaValidation),
	users.read.handler,
]);
// need auth
simpleRouter.register('delete', '/users', [
	apiResponse,
	paramValidator(users._delete.schemaValidation),
	users._delete.handler,
]);

simpleRouter.register('post', '/tokens', [
	apiResponse,
	paramValidator(tokens.create.schemaValidation),
	tokens.create.handler,
]);
// need auth
simpleRouter.register('put', '/tokens', [
	apiResponse,
	paramValidator(tokens.update.schemaValidation),
	tokens.update.handler,
]);
// need auth
simpleRouter.register('get', '/tokens', [
	apiResponse,
	paramValidator(tokens.read.schemaValidation),
	tokens.read.handler,
]);
// need auth
simpleRouter.register('delete', '/tokens', []);

module.exports = simpleRouter.router;
