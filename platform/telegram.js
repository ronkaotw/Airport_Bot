const TelegramBot = require('node-telegram-bot-api');

function startTelegramPlatform(options) {
	const { token, onMessage } = options;
	const bot = new TelegramBot(token, { polling: true });

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
