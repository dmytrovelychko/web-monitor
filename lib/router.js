const SimpleRouter = require('./util/simple-api-router');

const { apiResponse, paramValidator, auth } = require('./middleware');
const users = require('./handlers/users');
const tokens = require('./handlers/tokens');
const checks = require('./handlers/checks');

const simpleRouter = new SimpleRouter();

/* @ TODO current CRUD uses 404 status if method not registered and if entity
          not found, we can split this by using errorCode inside api response */
simpleRouter.register('post', '/users', [
	apiResponse,
	paramValidator(users.create.schemaValidation),
	users.create.handler,
]);
simpleRouter.register('put', '/users', [
	apiResponse,
	auth,
	paramValidator(users.update.schemaValidation),
	users.update.handler,
]);
simpleRouter.register('get', '/users', [apiResponse, auth, users.read.handler]);
simpleRouter.register('delete', '/users', [
	apiResponse,
	auth,
	users.delete.handler,
]);

simpleRouter.register('post', '/tokens', [
	apiResponse,
	paramValidator(tokens.create.schemaValidation),
	tokens.create.handler,
]);
simpleRouter.register('put', '/tokens', [
	apiResponse,
	paramValidator(tokens.update.schemaValidation),
	tokens.update.handler,
]);
simpleRouter.register('get', '/tokens', [
	apiResponse,
	auth,
	paramValidator(tokens.read.schemaValidation),
	tokens.read.handler,
]);
simpleRouter.register('delete', '/tokens', [
	apiResponse,
	auth,
	paramValidator(tokens.delete.schemaValidation),
	tokens.delete.handler,
]);

simpleRouter.register('post', '/checks', [
	apiResponse,
	auth,
	paramValidator(checks.create.schemaValidation),
	checks.create.handler,
]);
simpleRouter.register('get', '/checks', [
	apiResponse,
	auth,
	paramValidator(checks.read.schemaValidation),
	checks.read.handler,
]);
simpleRouter.register('put', '/checks', [
	apiResponse,
	auth,
	paramValidator(checks.update.schemaValidation),
	checks.update.handler,
]);
simpleRouter.register('delete', '/checks', [
	apiResponse,
	auth,
	paramValidator(checks.delete.schemaValidation),
	checks.delete.handler,
]);

module.exports = simpleRouter.router;
