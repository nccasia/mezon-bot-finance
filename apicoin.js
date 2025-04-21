const axios = require("axios");
const cheerio = require("cheerio");
const API_KEY = "RQ1QBH4ZQNZ98MHT"; // Replace with your actual API key
const BASE_URL = "https://api.coingecko.com/api/v3";
const xml2js = require("xml2js");
async function getAllCoins() {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/24hr"
    );

    const coins = response.data.splice(0, 50).map((x) => x.symbol);

    console.log(coins)
    return coins;
  } catch (error) {
    console.error("Lỗi khi gọi API Binance:", error);
  }
}
async function getCoinDetails(symbol) {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/24hr",
      {
        params: {
          symbol,
        },
      }
    );

    const coinData = response.data;
     return coinData;

  } catch (error) {
    console.error("Lỗi khi gọi API Binance:", error);
  }
}
module.exports = { getAllCoins, getCoinDetails };
