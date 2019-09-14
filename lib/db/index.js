const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const log = require('../util/logger');

const BASE_DIR = path.join(__dirname, '../../.data');

async function create(dir, file, payload) {
	return await fsPromises.writeFile(`${BASE_DIR}/${dir}/${file}.json`, JSON.stringify(payload), { flag: 'wx' });
}

// @TODO need to be one transaction operation
async function update(dir, file, payload) {
	try {
		const updatedPayload = {
			...(await read(dir, file)),
			...payload,
		};

		return await fsPromises.writeFile(`${BASE_DIR}/${dir}/${file}.json`, JSON.stringify(updatedPayload), {
			flag: 'w',
		});
	} catch (err) {
		log.warn(`Failed to update a file with err: ${err}`);
	}
}

async function read(dir, file) {
	return JSON.parse(await fsPromises.readFile(`${BASE_DIR}/${dir}/${file}.json`, { encoding: 'utf-8' }));
}

async function _delete(dir, file) {
	try {
		return await fsPromises.unlink(`${BASE_DIR}/${dir}/${file}.json`);
	} catch (err) {
		log.warn(`Failed to delete a file with err: ${err}`);
	}
}

module.exports = {
	create,
	update,
	read,
	delete: _delete,
};
