const TelegramBot = require('node-telegram-bot-api');

function getTelegramErrorSummary(error) {
	if (!error) {
		return 'unknown error';
	}

	const statusCode = error.response && error.response.statusCode;
	const errorCode = error.code;
	const message = error.message || 'unknown error';

	return [statusCode ? `status=${statusCode}` : null, errorCode ? `code=${errorCode}` : null, message]
		.filter(Boolean)
		.join(' | ');
}

function startTelegramPlatform(options) {
	const { token, onMessage } = options;
	const bot = new TelegramBot(token, { polling: true });

	bot.on('polling_error', (error) => {
		console.error(`[Telegram polling] ${getTelegramErrorSummary(error)}`);
	});

	bot.on('message', async (msg) => {
		const chatId = msg.chat.id;
		const context = {
			platform: 'telegram',
			chatId,
			text: msg.text,
			rawMessage: msg,
			reply: (message) => bot.sendMessage(chatId, message),
		};

		await onMessage(context);
	});

	return bot;
}

module.exports = {
	startTelegramPlatform,
};
