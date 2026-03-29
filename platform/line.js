const crypto = require('crypto');
const axios = require('axios');

function verifyLineSignature(channelSecret, bodyBuffer, signature) {
	if (!signature) {
		return false;
	}

	const digest = crypto
		.createHmac('sha256', channelSecret)
		.update(bodyBuffer)
		.digest('base64');

	return digest === signature;
}

function toLineContext(event, channelAccessToken) {
	if (event.type !== 'message' || !event.message || event.message.type !== 'text') {
		return null;
	}

	const text = event.message.text;
	const chatId = event.source.userId || event.source.groupId || event.source.roomId || 'unknown';
	const replyToken = event.replyToken;

	return {
		platform: 'line',
		chatId,
		text,
		rawMessage: event,
		reply: async (message) => {
			await axios.post(
				'https://api.line.me/v2/bot/message/reply',
				{
					replyToken,
					messages: [
						{
							type: 'text',
							text: String(message),
						},
					],
				},
				{
					headers: {
						Authorization: `Bearer ${channelAccessToken}`,
						'Content-Type': 'application/json',
					},
				}
			);
		},
	};
}

function startLinePlatform(options) {
	const {
		app,
		channelSecret,
		channelAccessToken,
		onMessage,
		webhookPath = '/webhook/line',
	} = options;
	app.post(
		webhookPath,
		async (req, res) => {
			try {
				console.log(`[LINE Webhook] Received request on ${webhookPath}`);
				const signature = req.get('x-line-signature');
				const rawBody = req.rawBody;

				console.log(`[LINE Webhook] signature: ${signature}`);
				console.log(`[LINE Webhook] rawBody length: ${rawBody ? rawBody.length : 'missing'}`);
				console.log(`[LINE Webhook] channelSecret configured: ${!!channelSecret}`);

				if (!rawBody) {
					console.error('[LINE Webhook] raw body missing');
					res.status(200).json({ ok: true, ignored: true, reason: 'raw body missing' });
					return;
				}

				const isValid = verifyLineSignature(channelSecret, rawBody, signature);
				console.log(`[LINE Webhook] signature verification: ${isValid ? 'PASS' : 'FAIL'}`);
				if (!isValid) {
					console.error('[LINE Webhook] invalid signature - check if LINE_CHANNEL_SECRET is correct');
					res.status(200).json({ ok: true, ignored: true, reason: 'invalid signature' });
					return;
				}

				let payload;
				try {
					payload = JSON.parse(rawBody.toString('utf8'));
				} catch (parseError) {
					console.error('[LINE Webhook] invalid JSON payload', parseError);
					res.status(200).json({ ok: true, ignored: true, reason: 'invalid json' });
					return;
				}
				const events = Array.isArray(payload.events) ? payload.events : [];
				if (events.length === 0) {
					res.status(200).json({ ok: true, ignored: true, reason: 'no events' });
					return;
				}

				for (const event of events) {
					const context = toLineContext(event, channelAccessToken);
					if (!context) {
						continue;
					}
					try {
						await onMessage(context);
					} catch (messageError) {
						console.error('[LINE Webhook] onMessage failed', messageError);
					}
				}

				res.status(200).json({ ok: true });
			} catch (error) {
				console.error(error);
				res.status(200).json({ ok: true, ignored: true, reason: 'line webhook failed' });
			}
		}
	);
}

module.exports = {
	startLinePlatform,
};
