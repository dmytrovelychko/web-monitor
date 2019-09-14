const SimpleRouter = require('./util/simple-api-router');

const { apiResponse, paramValidator } = require('./middleware');
const { create, read } = require('./handlers/users');

const simpleRouter = new SimpleRouter();

simpleRouter.register('post', '/user', [apiResponse, paramValidator(create.schemaValidation), create.handler]);
simpleRouter.register('get', '/user', [apiResponse, paramValidator(read.schemaValidation), read.handler]);

module.exports = simpleRouter.router;
