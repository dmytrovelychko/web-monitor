const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const generalHandler = Symbol('generalHandler');
const getHandlersChain = Symbol('getHandlersChain');
const callHandlersChain = Symbol('callHandlersChain');
const aggregateHandlersChain = Symbol('aggregateHandlersChain');

class SimpleApiRouter {
	constructor() {
		this.routeRegistry = {
			HEAD: [],
			OPTIONS: [],
			GET: [],
			PUT: [],
			PATCH: [],
			POST: [],
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

			// 1e7 ~~~ 10MB
			if (buffer.length > 1e7) {
				res.writeHead(413, { 'Content-Type': 'text/plain' }).end();
				req.connection.destroy();
			}
		});
		req.on('end', () => {
			buffer += decoder.end();

			this[generalHandler](req, res, buffer);
		});
	}

	// Register order for one method will set priority matching
	// @TODO accept handlersChain as a list of arguments
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

	// @TODO accept non json content to another ctx parameter
	async [generalHandler](req, res, buffer) {
		let bodyParams = {};

		const { path, queryStringParams } = parseUrl(req.url);

		if (req.headers['content-type'] === 'application/json') {
			try {
				bodyParams = JSON.parse(buffer || {});
			} catch (err) {
				return res.writeHead(400, { 'Content-Type': 'text/plain' }).end();
			}
		}

		let result = {};

		try {
			result = await this[callHandlersChain](req.method, path, {
				params: {
					...queryStringParams,
					...bodyParams,
				},
			});
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Internal server error');
		}

		const payloadString = JSON.stringify(typeof result.payload === 'object' ? result.payload : {});

		res.setHeader('Content-Type', 'application/json');
		res.writeHead(typeof result.statusCode === 'number' ? result.statusCode : 200);
		res.end(payloadString);
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

	async [callHandlersChain](method, path, ctx) {
		const handlersChain = this[getHandlersChain](method, path);

		return await this[aggregateHandlersChain](handlersChain, ctx)();
	}

	[aggregateHandlersChain](handlersChain, ctx) {
		// @TODO if length 0
		let i = handlersChain.length - 1;
		let fn = handlersChain[i].bind(null, ctx);

		for (; i > 0; i--) {
			fn = handlersChain[i - 1].bind(null, ctx, fn);
		}

		return fn;
	}
}

async function notFound() {
	return {
		statusCode: 404,
	};
}

function parseUrl(reqUrl) {
	const parsedUrl = url.parse(reqUrl, true);

	return {
		path: parsedUrl.pathname.replace(/\/+/g, '/').replace(/\/$/g, ''),
		queryStringParams: parsedUrl.query,
	};
}

module.exports = SimpleApiRouter;
