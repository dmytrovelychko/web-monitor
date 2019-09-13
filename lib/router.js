const SimpleRouter = require('./util/simple-api-router');

const { apiResponse, paramValidator } = require('./middleware');
const { create } = require('./handlers/users');

const simpleRouter = new SimpleRouter();

simpleRouter.register('post', '/user', [apiResponse, paramValidator(create.schemaValidation), create.handler]);

module.exports = simpleRouter.router;
