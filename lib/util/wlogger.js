const { createLogger, format, transports } = require('winston');

const logFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
	transports: [
		new transports.File({
			level: 'warn',
			filename: 'combined.log',
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});

logger.exceptions.handle(new transports.File({ filename: 'exceptions.log' }));

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), format.timestamp(), logFormat),
		}),
	);
}

module.exports = logger;
