const config = require('config');
const querystring = require('querystring');
const https = require('https');

const twilioRequestOptions = {
	protocol: 'https:',
	hostname: 'api.twilio.com',
	method: 'POST',
	path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
	// seems not secure
	auth: `${config.get('twilio.accountSid')}:${config.get(
		'twilio.authToken',
	)}`,
};

function sendRequest(requestDetails, stringPayload) {
	return new Promise((resolve, reject) => {
		const req = https.request(requestDetails, res => resolve(res));

		req.on('error', e => reject(e));
		req.write(stringPayload);
		req.end();
	});
}

async function sendSMS(toPhone, msg) {
	const payload = {
		From: config.get('twilio.fromPhone'),
		To: `+38${toPhone}`,
		Body: msg,
	};

	const stringPayload = querystring.stringify(payload);

	const requestDetails = {
		...twilioRequestOptions,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(stringPayload),
		},
	};

	return await sendRequest(requestDetails, stringPayload);
}

module.exports = {
	sendSMS,
};
