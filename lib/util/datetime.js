const jsIntToMysqlDatetime = unixTime =>
	new Date(unixTime)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');

module.exports = {
	jsIntToMysqlDatetime,
};
