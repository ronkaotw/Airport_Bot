const axios = require('axios');

const CHECKWX_API_KEY = process.env.CHECKWX_API_KEY;
const BASE_URL = 'https://api.checkwx.com';

async function fetchFirstData(path) {
	const url = `${BASE_URL}/${path}?x-api-key=${CHECKWX_API_KEY}`;
	const response = await axios.get(url);
	return response.data && response.data.data ? response.data.data[0] : null;
}

async function getAirportInfo(airportCode) {
	return fetchFirstData(`station/${airportCode}`);
}

async function getMetar(airportCode) {
	return fetchFirstData(`metar/${airportCode}`);
}

async function getTaf(airportCode) {
	return fetchFirstData(`taf/${airportCode}`);
}

async function getAirmet(airportCode) {
	return fetchFirstData(`airmet/${airportCode}/decoded`);
}

module.exports = {
	getAirportInfo,
	getMetar,
	getTaf,
	getAirmet,
};
