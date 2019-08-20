const http = require('http');
const https = require('https');
const fs = require('fs');

const { routingHandler } = './lib/router';

const config = require('./config');

const httpServer = http.createServer(routingHandler);

httpServer.listen(config.httpPort, () => {
	console.log(`The HTTP server is running on port ${config.httpPort}`);
});

const httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, routingHandler);

httpsServer.listen(config.httpsPort, () => {
	console.log(`The HTTPS server is running on port ${config.httpsPort}`);
});
