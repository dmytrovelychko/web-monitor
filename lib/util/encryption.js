const crypto = require('crypto');

const encodePassword = (password, salt) => {
	return crypto
		.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
		.toString(`hex`);
};

const createRandomString = length => {
	return crypto.randomBytes(length).toString('hex');
};

const validatePassword = (password, passHash, salt) => {
	const inPasswordHash = encodePassword(password, salt);

	return inPasswordHash === passHash;
};

module.exports = {
	encodePassword,
	createRandomString,
	validatePassword,
};
