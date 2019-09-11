const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const generalHandler = Symbol('generalHandler');
const getHandlersChain = Symbol('getHandlersChain');

class SimpleRouter {
	constructor() {
		this.routeRegistry = {
			POST: [],
			GET: [],
			PUT: [],
			DELETE: [],
		};

		this.router = this.router.bind(this);
	}

	// @TODO we can decline request processing right away if method / handler not found before fill in all buffer
	router(req, res) {
		const decoder = new StringDecoder('utf-8');

		let buffer = '';

		req.on('data', data => {
			buffer += decoder.write(data);
		});
		req.on('end', () => {
			buffer += decoder.end();
			this[generalHandler](req, res, buffer);
		});
	}

	// Register order for one method will set priority matching
	register(method, path, handlersChain) {
		const methodRegistry = this.routeRegistry[method.toUpperCase()];

		if (!methodRegistry) {
			throw new Error('Not appropriate method for route registry');
		}

		if (!Array.isArray(handlersChain)) {
			throw new Error('handlersChain should be an array');
		}

		methodRegistry.push({ path, handlersChain });
	}

	async [generalHandler](req, res, buffer) {
		const { path, params, method, headers } = getRequestValues(req);
		const chosenHandler = this[getHandlersChain](method, path)[0];

		const { statusCode, payload } = await chosenHandler({
			params,
			headers,
			payload: buffer,
		});

		const payloadString = JSON.stringify(typeof payload === 'object' ? payload : {});

		res.setHeader('Content-Type', 'application/json');
		res.writeHead(typeof statusCode === 'number' ? statusCode : 200);
		res.end(payloadString);

		// @TODO remove
		const log = require('./logger');

		log.info(`Returning this response: ${statusCode}, ${payloadString}`);
	}

	[getHandlersChain](method, _path) {
		const methodRegistry = this.routeRegistry[method];

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
}

async function notFound() {
	return {
		statusCode: 404,
		res: 'not_found',
	};
}

function getRequestValues(req) {
	const parsedUrl = url.parse(req.url, true);

	// @TODO extract all body and query params into one object
	return {
		path: parsedUrl.pathname.replace(/\/+/g, '/').replace(/\/$/g, ''),
		params: {},
		method: req.method,
		headers: req.headers,
	};
}

module.exports = SimpleRouter;
