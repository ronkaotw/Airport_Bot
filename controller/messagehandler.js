const {
	getAirportInfo,
	getMetar,
	getTaf,
	getAirmet,
} = require('../service/weatherService');

const HELP_TEXT = `哈囉！歡迎使用機師天氣查詢系統！
以下是所有指令的使用表格：
	/airport ICAO
	/metar ICAO
	/taf ICAO
	/airmet ICAO
	/dev 取得開發人員資料`;

const DEV_TEXT = `開發人員名稱: Aaron
開發人員GitHub: @uTIstIbL
開發人員網站: ronkao.tw
開發人員linkedin: www.linkedin.com/in/aaron-kao884b2319a`;

function getErrorSummary(error) {
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

function parseCommand(text) {
	if (!text || !text.startsWith('/')) {
		return null;
	}

	const tokens = text.trim().split(/\s+/);
	const command = (tokens[0] || '').toLowerCase();
	const args = tokens.slice(1);

	return { command, args };
}

async function handleAirport(args, reply) {
	const airportCode = (args[0] || '').trim();
	if (!airportCode) {
		await reply('請提供有效的 ICAO 代碼');
		return;
	}

	const airportData = await getAirportInfo(airportCode);
	if (!airportData) {
		await reply('查無機場資料，請確認 ICAO 代碼');
		return;
	}

	await reply(`查詢到的機場為: ${airportData.icao} - 機場名稱: ${airportData.name} - 城市名稱: ${airportData.city}`);
}

async function handleMetar(args, reply) {
	const airportCode = (args[0] || '').trim();
	if (!airportCode) {
		await reply('請提供有效的 ICAO 代碼');
		return;
	}

	const metarData = await getMetar(airportCode);
	if (!metarData) {
		await reply('查無 METAR 資料，請確認 ICAO 代碼');
		return;
	}

	await reply(`mETAR: ${metarData}`);
}

async function handleTaf(args, reply) {
	const airportCode = (args[0] || '').trim();
	if (!airportCode) {
		await reply('請提供有效的 ICAO 代碼');
		return;
	}

	const tafData = await getTaf(airportCode);
	if (!tafData) {
		await reply('查無 TAF 資料，請確認 ICAO 代碼');
		return;
	}

	await reply(`TAF: ${tafData}`);
}

async function handleAirmet(args, reply) {
	const airportCode = (args[0] || '').trim();
	if (!airportCode) {
		await reply('請提供有效的 ICAO 代碼');
		return;
	}

	const airmetData = await getAirmet(airportCode);
	if (!airmetData) {
		await reply('查無 AIRMET 資料，請確認 ICAO 代碼');
		return;
	}

	await reply(`Airmet: ${airmetData.raw_text}`);
}

async function handleMessage(context) {
	const commandInfo = parseCommand(context.text);
	if (!commandInfo) {
		return;
	}

	const { command, args } = commandInfo;
	const { reply } = context;

	try {
		switch (command) {
		case '/start':
			await reply(HELP_TEXT);
			break;
		case '/airport':
			await handleAirport(args, reply);
			break;
		case '/metar':
			await handleMetar(args, reply);
			break;
		case '/taf':
			await handleTaf(args, reply);
			break;
		case '/airmet':
			await handleAirmet(args, reply);
			break;
		case '/dev':
			await reply(DEV_TEXT);
			break;
		default:
			break;
		}
	} catch (error) {
		console.error(`[handleMessage] ${getErrorSummary(error)}`);
		await reply('查詢失敗，請稍後再試');
	}
}

module.exports = {
	handleMessage,
};
