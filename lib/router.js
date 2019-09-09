const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const log = require('./util/logger');

const handlers = {};

handlers.ping = function(data, callback) {
	callback(200, { name: 'I am alive' });
};

handlers.notFound = function(data, callback) {
	callback(404, { res: 'not_found' });
};

const routeRegistry = {
	ping: handlers.ping,
};

function parseUrl(reqUrl) {
	const parsedUrl = url.parse(reqUrl, true);

	return {
		path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
		queryStringObject: parsedUrl.query,
	};
}

const router = function(req, res) {
	const { path, queryStringObject } = parseUrl(req.url);
	const method = req.method.toLowerCase();
	const headers = req.headers;

	const decoder = new StringDecoder('utf-8');

	let buffer = '';

	req.on('data', data => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		// Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
		const chosenHandler = typeof routeRegistry[path] === 'undefined' ? handlers.notFound : routeRegistry[path];

		// Construct the data object to send to the handler
		const data = {
			path,
			queryStringObject,
			method,
			headers,
			payload: buffer,
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, (statusCode, payload) => {
			// Use the status code returned from the handler, or set the default status code to 200
			statusCode = typeof statusCode === 'number' ? statusCode : 200;

			// Use the payload returned from the handler, or set the default payload to an empty object
			payload = typeof payload === 'object' ? payload : {};

			// Convert the payload to a string
			const payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			log.info(`Returning this response: ${statusCode}, ${payloadString}`);
		});
	});
};

module.exports = {
	router,
};
