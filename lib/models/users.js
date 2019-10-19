const uuid = require('uuid');
const { getConnection } = require('../db');

const MODEL_NAME = 'user';

// Access to connection pool, we don't control acquire connection here
const conn = getConnection();

async function create(record) {
	await conn(MODEL_NAME).insert({
		id: uuid(),
		...record,
	});
}

module.exports = {
	create,
};
