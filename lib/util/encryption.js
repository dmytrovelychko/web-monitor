const crypto = require('crypto');

module.exports = {
	encodePassword: (password, salt) => {
		return crypto
			.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
			.toString(`hex`);
	},
	createSalt: () => {
		return crypto.randomBytes(16).toString('hex');
	},
};
