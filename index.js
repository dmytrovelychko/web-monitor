const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('config');

const log = require('./lib/util/logger');
const router = require('./lib/router');

const httpServer = http.createServer(router);

httpServer.listen(config.httpPort, () => {
	log.info(`The HTTP server is running on port ${config.httpPort}`);
});

const httpsServerOptions = {
	key: fs.readFileSync('./https/server-options/server.key'),
	cert: fs.readFileSync('./https/server-options/server.crt'),
};

const httpsServer = https.createServer(httpsServerOptions, router);

httpsServer.listen(config.httpsPort, () => {
	log.info(`The HTTPS server is running on port ${config.httpsPort}`);
});
