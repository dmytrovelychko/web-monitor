const log = require('./util/logger');

const init = async () => {
	log.info('Background job setup finished');
};

module.exports = {
	init,
};
