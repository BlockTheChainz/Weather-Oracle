const ABI = [{"inputs":[{"internalType":"address","name":"_relayer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_decimals","type":"uint256"}],"name":"setDecimals","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_relayer","type":"address"}],"name":"setRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"temp","type":"uint256"}],"name":"updateTemperature","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRelayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRoundedTemperature","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTemperature","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const ADDRESS = '0xC53029ef10f3B1F6D02a09dB017eB316d2f23edF';
const decimals = 4

const axios = require('axios');
const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

async function main(signer, temperature) {
    const contract = new ethers.Contract(ADDRESS, ABI, signer);
    const tx = await contract.updateTemperature(temperature);
    console.log(`Updated temperature to ${temperature}`);
}

async function getWeatherData() {
  try {
	const response = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=API_KEY&units=metric");
    const temperature = response.data.main.temp;
    const roundedTemp = Math.round(temperature * Math.pow(10, decimals))
    return roundedTemp;
  } catch(error) {
  console.error(error);
    return -1;
  }
}

exports.handler = async function(credentials) {
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast'});
  console.log(`Using relayer ${await signer.getAddress()}`);
  const temperature = await getWeatherData();
  if(temperature == -1) {
  	return;
  } else {
      await main(signer, temperature);
  }
}
