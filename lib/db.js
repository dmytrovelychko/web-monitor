const config = require('config');
const knex = require('knex');

let connPool = null;

async function init() {
	connPool = await knex({
		client: 'mysql',
		connection: {
			host: config.get('db.host'),
			port: config.get('db.port'),
			user: config.get('db.user'),
			password: config.get('db.password'),
			database: config.get('db.database'),
		},
		pool: { min: 1, max: 10 },
	});

	await connPool.raw('select 1+1 as result');
}

module.exports = {
	init,
	getConn: () => connPool,
};
