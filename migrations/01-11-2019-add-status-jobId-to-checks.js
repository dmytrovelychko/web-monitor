exports.up = function(knex) {
	return knex.schema.alterTable('checks', table => {
		table.enu('status', ['stopped', 'up', 'down']).defaultTo('up');
		table.string('jobId', 255);
	});
};

exports.down = function(knex) {
	return knex.schema.alterTable('checks', table => {
		table.dropColumn('status');
		table.dropColumn('jobId');
	});
};
