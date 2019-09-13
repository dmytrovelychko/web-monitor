function normalizeValidationError(error) {
	const generalMessage = 'Validation error';

	try {
		return error.details[0].message || generalMessage;
	} catch (err) {
		return generalMessage;
	}
}

module.exports = function paramsValidatorWrapper(schema) {
	return async function paramsValidator(ctx, next) {
		const { value, error } = schema.validate(ctx.params);

		if (error) {
			const err = new Error(normalizeValidationError(error));

			err.statusCode = 400;

			throw err;
		}

		ctx.params = value;

		return await next();
	};
};
