const ABI = [{"inputs":[{"internalType":"address","name":"_relayer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_relayer","type":"address"}],"name":"setRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"int256","name":"temperature","type":"int256"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"lon","type":"int256"}],"internalType":"struct Weather.WeatherData","name":"weatherData","type":"tuple"}],"name":"updateWeatherData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"counter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestRoundedTemperature","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWeather","outputs":[{"components":[{"internalType":"int256","name":"temperature","type":"int256"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"lon","type":"int256"}],"internalType":"struct Weather.WeatherData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRelayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getWeather","outputs":[{"components":[{"internalType":"int256","name":"temperature","type":"int256"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"lon","type":"int256"}],"internalType":"struct Weather.WeatherData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
const ADDRESS = 'CONTRACT_ADDRESS_HERE'
const decimals = 4

const axios = require('axios');
const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

async function main(signer, body) {
    const contract = new ethers.Contract(ADDRESS, ABI, signer);
    const tx = await contract.updateWeatherData(body);
  	return body;
}

async function getWeatherData(apiKey, lat, lon) {
  try {
	const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const temperature = response.data.main.temp;
    const roundedTemp = Math.round(temperature * Math.pow(10, decimals))
    return roundedTemp;
  } catch(error) {
  console.error(error);
    return null;
  }
}

exports.handler = async function(credentials) {
    const {
    body,
    headers,
    queryParameters,
  } = credentials.request;
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast'});
  console.log(`Using relayer ${await signer.getAddress()}`);
  const lat = queryParameters.lat;
  const lon = queryParameters.lon;
  const apiKey = "API_KEY_HERE";
  const temperature = await getWeatherData(apiKey, lat, lon);
   const struct = {
    	lat: Math.round(lat * Math.pow(10, decimals)),
        lon: Math.round(lon * Math.pow(10, decimals)),
        temperature: temperature,
        decimals: decimals
    }
  if(temperature == null) {
  	return;
  } else {
    return await main(signer, struct);
  }
}
