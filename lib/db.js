const config = require('config');
const Knex = require('knex');

const log = require('../lib/util/logger');

let knex = null;

async function init() {
	knex = await new Knex({
		client: 'mysql',
		connection: {
			host: config.get('db.host'),
			port: config.get('db.port'),
			user: config.get('db.user'),
			password: config.get('db.password'),
			database: config.get('db.database'),
		},
		migrations: {
			tableName: 'migrations',
		},
		pool: { min: 1, max: 10 },
	});

	await knex.raw('select 1+1 as result');
	log.info(`db connection established`);

	// @TODO make it optional in dev or move to a separate startup stage
	try {
		await knex.migrate.latest();
		log.info(`db migrations done`);
	} catch (err) {
		log.info(`db migrations failed`);

		await knex.migrate.rollback();
		log.info('db migrations latest rolledbacked');

		throw err;
	}
}

module.exports = {
	init,
	getConnection: () => knex,
};
