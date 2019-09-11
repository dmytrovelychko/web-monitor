const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const log = require('./util/logger');

async function notFound() {
	return {
		statusCode: 404,
		res: 'not_found',
	};
}

const routeRegistry = {
	post: [],
	get: [],
	put: [],
	delete: [],
};

// Register order for one method will set priority matching
function register(method, path, handlersChain) {
	const methodRegistry = routeRegistry[method];

	if (!methodRegistry) {
		throw new Error('Not appropriate method for route registry');
	}

	if (!Array.isArray(handlersChain)) {
		throw new Error('handlersChain should be an array');
	}

	methodRegistry.push({ path, handlersChain });
}

function getHandlersChain(method, _path) {
	const methodRegistry = routeRegistry[method];

	if (!methodRegistry) {
		return [notFound];
	}

	for (const { path, handlersChain } of methodRegistry) {
		// test usage of '/'
		if (path.match(`^${_path}$`)) {
			return handlersChain;
		}
	}

	return [notFound];
}

function getRequestValues(req) {
	const parsedUrl = url.parse(req.url, true);

	// @TODO extract all body and query params into one object
	return {
		path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
		params: {},
		method: req.method.toLocaleLowerCase(),
		headers: req.headers,
	};
}

async function _generalHandler(req, res, buffer) {
	const { path, params, method, headers } = getRequestValues(req);
	const chosenHandler = getHandlersChain(method, path)[0];

	const { statusCode, payload } = await chosenHandler({
		params,
		headers,
		payload: buffer,
	}); // will return promise

	const payloadString = JSON.stringify(typeof payload === 'object' ? payload : {});

	res.setHeader('Content-Type', 'application/json');
	res.writeHead(typeof statusCode === 'number' ? statusCode : 200);
	res.end(payloadString);

	log.info(`Returning this response: ${statusCode}, ${payloadString}`);
}

// @TODO we can decline request processing right away if method / handler not found before fill in all buffer
function generalHandler(req, res) {
	const decoder = new StringDecoder('utf-8');

	let buffer = '';

	req.on('data', data => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();
		_generalHandler(req, res, buffer);
	});
}

module.exports = {
	generalHandler,
	register,
};
