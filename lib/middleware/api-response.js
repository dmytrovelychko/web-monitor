const process = require('process');

module.exports = async function apiErrorHandler(ctx, next) {
	try {
		const result = (await next()) || {};

		return {
			statusCode: result.statusCode || 200,
			payload: {
				success: true,
				data: result.data || {},
				error: null,
			},
		};
	} catch (err) {
		return {
			statusCode: err.statusCode || 500,
			payload: {
				success: false,
				data: {},
				error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
			},
		};
	}
};
