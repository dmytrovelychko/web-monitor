const config = require('config');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const logFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
	transports: [
		new transports.File({
			level: 'warn',
			filename: path.join(config.logger.logDir, 'combined.log'),
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});

logger.exceptions.handle(
	new transports.File({
		filename: path.join(config.logger.logDir, 'exceptions.log'),
	}),
);

if (config.logger.console) {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), format.timestamp(), logFormat),
		}),
	);
}

module.exports = logger;
