exports.up = function(knex) {
	return knex.schema
		.createTable('user', table => {
			table.specificType('id', 'char(36)').primary();
			table.string('firstName', 255).notNullable();
			table.string('lastName', 255);
			table
				.string('phone', 255)
				.unique()
				.notNullable();
			table.string('password', 255).notNullable();
			table.string('salt', 255).notNullable();
		})
		.createTable('token', table => {
			table.specificType('id', 'char(36)').primary();
			table.specificType('userId', 'char(36)').notNullable();
			table.foreign('userId').references('user.id');
			table.dateTime('expire').notNullable();
		})
		.createTable('check', table => {
			table.specificType('id', 'char(36)').primary();
			table.specificType('userId', 'char(36)').notNullable();
			table.foreign('userId').references('user.id');
			table.string('protocol', 10);
			table.string('url', 255);
			table.string('method', 255);
			table.string('successCodes', 255);
			table.integer('timeoutSec');
		});
};

exports.down = function(knex) {
	return knex.schema
		.dropTable('check')
		.dropTable('token')
		.dropTable('user');
};
