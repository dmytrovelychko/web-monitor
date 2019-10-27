const uuid = require('uuid');
const crypto = require('crypto');

const db = require('../db');

const MODEL_NAME = 'checks';

async function create(data) {
	const conn = db.getConnection();

	const record = {
		...data,
		id: data.id ? data.id : uuid(),
	};

	await conn(MODEL_NAME).insert(record);

	return record.id;
}

async function createUnique(data) {
	const conn = db.getConnection();

	const record = {
		...data,
		id: data.id
			? data.id
			: crypto
					.createHash('md5')
					.update(JSON.stringify(data))
					.digest('hex'),
	};

	await conn(MODEL_NAME).insert(record);

	return record.id;
}

async function update(data) {
	const conn = db.getConnection();

	await conn(MODEL_NAME).update(data);
}

async function updateById(id, data) {
	const conn = db.getConnection();

	await conn(MODEL_NAME)
		.where({ id })
		.update(data);
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

async function findAll(whereObj) {
	const conn = db.getConnection();

	return await conn(MODEL_NAME).where(whereObj);
}

module.exports = {
	create,
	update,
	updateById,
	getById,
	deleteById,
	find,
	findAll,
	createUnique,
};
