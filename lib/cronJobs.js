const log = require('./util/logger');
const checkModel = require('../lib/models/checks');
// const userModel = require('../lib/models/users');
// const doCheck = async check => {};

const init = async () => {
	const checks = await checkModel.findAll();

	// get all checks
	// for every check start repeatable checks
	// on check fail notify

	console.log(checks);

	// checks.map(check => limit(doCheck(check)));

	log.info('Background job setup finished');
};

module.exports = {
	init,
};
