const uuid = require('uuid');
const db = require('../db');

const MODEL_NAME = 'users';

async function create(record) {
	const conn = db.getConnection();
	const id = uuid();

	await conn(MODEL_NAME).insert({
		id,
		...record,
	});

	return id;
}

async function update(data) {
	const conn = db.getConnection();

	await conn(MODEL_NAME).update(data);
}

async function getById(id) {
	const conn = db.getConnection();

	return await conn(MODEL_NAME)
		.first('*')
		.where('id', '=', id);
}

module.exports = {
	create,
	update,
	getById,
};
