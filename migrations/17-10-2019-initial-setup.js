exports.up = function(knex) {
	return knex.schema
		.createTable('users', table => {
			table.specificType('id', 'char(36)').primary();
			table.string('firstName', 255).notNullable();
			table.string('lastName', 255);
			table
				.string('phone', 255)
				.unique()
				.notNullable();
			table.string('password', 255).notNullable();
			table.string('salt', 255).notNullable();
			table
				.dateTime('createdAt')
				.notNullable()
				.defaultTo(knex.fn.now());
			table
				.dateTime('updatedAt')
				.notNullable()
				.defaultTo(
					knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
				);
		})
		.createTable('tokens', table => {
			table.specificType('id', 'char(36)').primary();
			table.specificType('userId', 'char(36)').notNullable();
			table.foreign('userId').references('users.id');
			table.dateTime('expire').notNullable();
			table
				.dateTime('createdAt')
				.notNullable()
				.defaultTo(knex.fn.now());
			table
				.dateTime('updatedAt')
				.notNullable()
				.defaultTo(
					knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
				);
		})
		.createTable('checks', table => {
			table.specificType('id', 'char(36)').primary();
			table.specificType('userId', 'char(36)').notNullable();
			table.foreign('userId').references('users.id');
			table.string('protocol', 10);
			table.string('url', 255);
			table.string('method', 255);
			table.string('successCodes', 255);
			table.integer('timeoutSeconds');
			table
				.dateTime('createdAt')
				.notNullable()
				.defaultTo(knex.fn.now());
			table
				.dateTime('updatedAt')
				.notNullable()
				.defaultTo(
					knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
				);
		});
};

exports.down = function(knex) {
	return knex.schema
		.dropTable('checks')
		.dropTable('tokens')
		.dropTable('users');
};
