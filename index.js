const http = require('http');
const https = require('https');
const fs = require('fs');

const log = require('./lib/util/logger');
const { router } = require('./lib/router');

const config = require('config');

const httpServer = http.createServer(router);

httpServer.listen(config.httpPort, () => {
	log.info(`The HTTP server is running on port ${config.httpPort}`);
});

const httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, router);

httpsServer.listen(config.httpsPort, () => {
	log.info(`The HTTPS server is running on port ${config.httpsPort}`);
});
