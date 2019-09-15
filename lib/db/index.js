const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const BASE_DIR = path.join(__dirname, '../../.data');

async function create(dir, file, payload) {
	return await fsPromises.writeFile(
		`${BASE_DIR}/${dir}/${file}.json`,
		JSON.stringify(payload),
		{ flag: 'wx' },
	);
}

// @TODO read+write need to be one transaction operation
async function update(dir, file, payload) {
	let oldPayload = null;

	try {
		oldPayload = await read(dir, file);
	} catch (err) {
		if (err.code === 'ENOENT') {
			await create(dir, file, payload);

			return { created: true };
		}

		throw err;
	}

	const updatedPayload = {
		...oldPayload,
		...payload,
	};

	return await fsPromises.writeFile(
		`${BASE_DIR}/${dir}/${file}.json`,
		JSON.stringify(updatedPayload),
		{
			flag: 'w',
		},
	);
}

async function read(dir, file) {
	return JSON.parse(
		await fsPromises.readFile(`${BASE_DIR}/${dir}/${file}.json`, {
			encoding: 'utf-8',
		}),
	);
}

async function rm(dir, file) {
	return await fsPromises.unlink(`${BASE_DIR}/${dir}/${file}.json`);
}

module.exports = {
	create,
	update,
	read,
	rm,
};
