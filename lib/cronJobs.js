const request = require('request-promise-native');

const log = require('./util/logger');
const checkModel = require('../lib/models/checks');
const { CHECK_STATUSES } = checkModel;
// const userModel = require('../lib/models/users');

const CHECK_INTERVAL_MS = 5 * 1000;

// @TODO need to split every check start in time to make spike longer
async function setupCheck(check) {
	if (check.status === CHECK_STATUSES.STOPPED) {
		log.info(`Skipped check with id: ${check.id}`);

		return;
	}

	const intId = setInterval(async check => {
		try {
			const {
				id,
				protocol,
				url,
				method,
				successCodes,
				timeoutSeconds,
			} = check;
			const statusCodes = successCodes
				? successCodes.split(' ').map(s => parseInt(s, 10))
				: [200];

			const response = request({
				method,
				uri: `${protocol}://${url}`,
				timeout: timeoutSeconds * 1000,
				resolveWithFullResponse: true,
			});

			log.info(response);

			if (
				check.status === CHECK_STATUSES.UP &&
				!statusCodes.includes(response.status)
			) {
				await checkModel.updateById(id, {
					status: CHECK_STATUSES.DOWN,
				});

				// @TODO notify user

				log.info(
					`Status for check:${id} has changed to - ${CHECK_STATUSES.DOWN}`,
				);
			}

			if (
				check.status === CHECK_STATUSES.DOWN &&
				statusCodes.includes(response.status)
			) {
				await checkModel.updateById(id, {
					status: CHECK_STATUSES.UP,
				});

				// @TODO notify user

				log.info(
					`Status for check:${id} has changed to - ${CHECK_STATUSES.UP}`,
				);
			}
		} catch (err) {
			log.error(err);
		}
	}, CHECK_INTERVAL_MS);

	await checkModel.updateById(check.id, {
		jobId: intId,
	});
}

const init = async () => {
	const checks = await checkModel.findAll();

	await Promise.all(checks.map(setupCheck));

	log.info('Background job setup finished');
};

module.exports = {
	init,
};
