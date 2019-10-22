const uuid = require('uuid');
const db = require('../db');

const MODEL_NAME = 'tokens';

async function create(data) {
	const conn = db.getConnection();
	const record = {
		...data,
		id: data.id ? data.id : uuid(),
	};

	await conn(MODEL_NAME).insert(record);

	return record.id;
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

async function deleteById(id) {
	const conn = db.getConnection();

	return await conn(MODEL_NAME)
		.where('id', '=', id)
		.del();
}

async function find(whereObj) {
	const conn = db.getConnection();

	return await conn(MODEL_NAME)
		.first('*')
		.where(whereObj);
}

module.exports = {
	create,
	update,
	getById,
	deleteById,
	find,
};
