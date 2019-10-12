module.exports = {
	logger: {
		logDir: 'logs',
		console: true,
	},
	httpPort: 3000,
	httpsPort: 3001,
	db: {
		host: process.env.WM_DB_HOST,
		user: process.env.WM_DB_USER,
		password: process.env.WM_DB_PASSWORD,
	},
};
