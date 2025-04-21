const axios = require("axios");
const cheerio = require("cheerio");
const API_KEY = "csgevq1r01qldu0co0j0csgevq1r01qldu0co0jg"; // Replace with your actual API key
const API_KEY2 = "RQ1QBH4ZQNZ98MHT"; // Replace with your actual API key
const BASE_URL = "https://finnhub.io/api/v1";
const xml2js = require("xml2js");

// Format response data for easier consumption
function formatPriceData(data) {
  return {
    currentPrice: data.c,
    openPrice: data.o,
    highPrice: data.h,
    lowPrice: data.l,
    previousClose: data.pc,
    change: data.d,
    changePercent: data.dp,
    tradingVolume: data.s,
  };
}

// Hàm lấy giá cổ phiếu theo mã cổ phiếu
async function fetchPrice(symbol) {
  try {
    const response = await axios.get(
      `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );
    return formatPriceData(response.data); // Format the price data
  } catch (error) {
    console.error("Error fetching price:", error);
    throw error;
  }
}

// Hàm lấy vốn hóa thị trường theo mã cổ phiếu
async function fetchMarketCap(symbol) {
  try {
    const response = await axios.get(
      `${BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`
    );
    console.log("data fetch", response.data);
    return response.data.metric.marketCapitalization;
  } catch (error) {
    console.error("Error fetching market cap:", error);
    throw error;
  }
}
// Hàm lấy EPS của cổ phiếu
async function fetchEPS(symbol) {
  try {
    const response = await axios.get(
      `${BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`
    );
    return response.data.metric.epsTTM;
  } catch (error) {
    console.error("Error fetching EPS:", error);
    throw error;
  }
}
async function fetchStockPeers(symbol) {
  try {
    const response = await axios.get(
      `${BASE_URL}/stock/peers?symbol=${symbol}&token=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock peers:", error);
    throw error;
  }
}
// Hàm lấy tin tức liên quan đến cổ phiếu
async function fetchNews(symbol, fromDate, toDate) {
  try {
    const response = await axios.get(
      `${BASE_URL}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

// Hàm so sánh hai mã cổ phiếu
async function compareSymbols(symbol1, symbol2) {
  const data1 = await fetchMarketCap(symbol1);
  const data2 = await fetchMarketCap(symbol2);
  return {
    [symbol1]: data1,
    [symbol2]: data2,
  };
}

// Hàm lấy tổng quan về cổ phiếu
async function fetchOverview(identifier, type = "symbol") {
  try {
    // Construct the URL based on the type of identifier
    let url = `${BASE_URL}/stock/profile2?token=${API_KEY}`;

    // Append the appropriate query parameter based on the type
    if (type === "symbol") {
      url += `&symbol=${identifier}`;
    } else if (type === "isin") {
      url += `&isin=${identifier}`;
    } else if (type === "cusip") {
      url += `&cusip=${identifier}`;
    } else {
      throw new Error(
        "Invalid type provided. Use 'symbol', 'isin', or 'cusip'."
      );
    }

    // Fetch the data from the constructed URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching overview:", error);
    throw error;
  }
}
// Hàm lấy khuyến nghị cho cổ phiếu
async function fetchRecommendation(symbol) {
  try {
    const response = await axios.get(
      `${BASE_URL}/stock/recommendation?symbol=${symbol}&token=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    throw error;
  }
}

async function fetchListCrypto() {
  try {
    const response = await axios.get(
      `${BASE_URL}/crypto/exchange?token=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    throw error;
  }
}
async function fetchListCryptoExchange() {
  try {
    const response = await axios.get(
      `${BASE_URL}/crypto/exchange?token=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    throw error;
  }
}

const findAllStock = async () => {
  try {
    const response = await axios.get(`https://simplize.vn/co-phieu`);

    const $ = cheerio.load(response.data); // Corrected this line
    const stocks = [];

    $("table tbody tr").each((index, element) => {
      if (index >= 2) {
        const stock = {
          code: $(element).find(".css-o2nxxm").text().trim(),
          company: $(element).find(".simplize-row > .css-uaw0ru > span").html(),
          capitalization: $(element)
            .find("td:nth-child(2)")
            .text()
            .trim()
            .replace(/[^0-9,]/g, ""),
          currentPrice: $(element)
            .find("td:nth-child(3)")
            .text()
            .trim()
            .replace(/[^0-9]/g, ""),
          priceChange: $(element)
            .find("td:nth-child(4)")
            .text()
            .trim()
            .replace(/[^0-9.-]/g, ""),
          change7Days: $(element)
            .find("td:nth-child(5)")
            .text()
            .trim()
            .replace(/[^0-9.-]/g, ""),
          change1Year: $(element)
            .find("td:nth-child(6)")
            .text()
            .trim()
            .replace(/[^0-9.-]/g, ""),
          peRatio: $(element)
            .find("td:nth-child(7)")
            .text()
            .trim()
            .replace(/[^0-9.]/g, ""),
          pbRatio: $(element)
            .find("td:nth-child(8)")
            .text()
            .trim()
            .replace(/[^0-9.]/g, ""),
          roe: $(element).find("td:nth-child(9)").text().trim(),
          projectedProfit3Years: $(element)
            .find("td:nth-child(10)")
            .text()
            .trim()
            .replace(/[^0-9.]/g, ""),
          dividendYield: $(element).find("td:nth-child(11)").text().trim(),
          exchange: $(element).find("td:nth-child(12)").text().trim(),
          industry: $(element).find("td:nth-child(13)").text().trim(),
        };
        stocks.push(stock);
      }
    });

    return stocks;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

const getPriceGold = async () => {
  try {
    const response = await axios.get("http://giavang.doji.vn/");

    const $ = cheerio.load(response.data);

    const json = {
      sjcHN: {
        buy: $(".goldprice-td-0", "#giavangtrongnuoc tr:first-child")
          .text()
          .trim(),
        sell: $(".goldprice-td-1", "#giavangtrongnuoc tr:first-child")
          .text()
          .trim(),
      },
      sjcHCM: {
        buy: $(".goldprice-td-0", "#giavangtrongnuoc tr:nth-child(2)")
          .text()
          .trim(),
        sell: $(".goldprice-td-1", "#giavangtrongnuoc tr:nth-child(2)")
          .text()
          .trim(),
      },
      sjcDN: {
        buy: $(".goldprice-td-0", "#giavangtrongnuoc tr:nth-child(3)")
          .text()
          .trim(),
        sell: $(".goldprice-td-1", "#giavangtrongnuoc tr:nth-child(3)")
          .text()
          .trim(),
      },
      "9999-HN": {
        buy: $(".goldprice-td-0", "#giavangtrongnuoc tr:nth-child(4)")
          .text()
          .trim(),
        sell: $(".goldprice-td-1", "#giavangtrongnuoc tr:nth-child(4)")
          .text()
          .trim(),
      },
      "999-HN": {
        buy: $(".goldprice-td-0", "#giavangtrongnuoc tr:nth-child(5)")
          .text()
          .trim(),
        sell: $(".goldprice-td-1", "#giavangtrongnuoc tr:nth-child(5)")
          .text()
          .trim(),
      },
    };

    return json;
  } catch (error) {
    console.log(error);
  }
};

const getForeignCurrency = async () => {
  try {
    const response = await axios.get(
      "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10"
    );
    const xmlData = response.data;

    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return reject(err);
        }

        const json = {
          DateTime: result.ExrateList.DateTime[0],
          Exrate: result.ExrateList.Exrate.map((exrate) => ({
            CurrencyCode: exrate.$.CurrencyCode,
            CurrencyName: exrate.$.CurrencyName,
            Buy: exrate.$.Buy,
            Transfer: exrate.$.Transfer,
            Sell: exrate.$.Sell,
          })),
          Source: result.ExrateList.Source[0],
        };

        resolve(json.Exrate);
      });
    });
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

const findStockDetail = async (code) => {
  try {
    const response = await axios.get(`https://simplize.vn/co-phieu/${code}`);

    const $ = cheerio.load(response.data);

    const main = $(
      "#phan-tich .css-1bmsgr6 .css-ngx7xr .css-9vd5ud .css-q0by2n .css-1g24t7h .simplize-row .simplize-col-16 .css-egmf3n "
    );

    const stockDetail = {
      name: $(".css-mm3aki h1").text().trim(),
      code: $(".css-1tda62w").html(),
      icon: `https://cdn.simplize.vn/simplizevn/logo/${code}.jpeg`,
      type: $(".css-tlfitm").html(),
      currentPrice: main
        .find(".simplize-col:nth-child(1) > div > div > p")
        .html(),
      priceChange: main
        .find(" .simplize-col:nth-child(1) > div > div > div > span")
        .html()
        .trim(),
      minPrice: $(".css-byibel").html(),
      maxPrice: $(".css-1f8rtlm").html(),
      capitalization: $(".css-2ndknz:nth-child(2) .css-1y6ypva").html(),
      pe: $(
        ".simplize-col-14 > div > .css-2ndknz > .css-1fd2jsl:nth-child(3) > dd > span"
      ).html(),
      eps: $(
        ".simplize-col-14 > div > .css-2ndknz > .css-1fd2jsl:nth-child(4) > dd > span"
      ).html(),
      tradingVolume: $(".css-2ndknz .css-1fd2jsl:first-child dd span").html(),
      pb: $(
        ".css-2ndknz:nth-child(3) .css-1fd2jsl:nth-child(2) dd span"
      ).html(),
      pb: $(
        ".css-2ndknz:nth-child(3) .css-1fd2jsl:nth-child(2) dd span"
      ).html(),
      bookValue: $(
        ".css-2ndknz:nth-child(3) .css-1fd2jsl:nth-child(3) dd span"
      ).html(),
      numberOfOutstandingShares: $(
        ".css-2ndknz:nth-child(4) .css-1fd2jsl dd span"
      ).html(),
      ev: $(
        ".css-2ndknz:nth-child(4) .css-1fd2jsl:nth-child(2) dd span"
      ).html(),

      website: null,
      businessQuality: $(".simplize-row .css-9dqd4c >  .css-1gfhhbu").html(),
      risk: $(".css-91aee8 .css-1h463hp .css-13yex1g").text().trim(),
      introduce: $("#main-service > div").html(),
    };

    return stockDetail;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

const convertUSDToVND = async (price) => {
  try {

     const response = await axios.get(
       "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10"
     );

     const xmlData = response.data;
     return new Promise((resolve, reject) => {
       xml2js.parseString(xmlData, (err, result) => {
         if (err) {
           console.error("Error parsing XML:", err);
           reject(err); // Reject the promise on error
           return;
         }

         const json = {
           DateTime: result.ExrateList.DateTime[0],
           Exrate: result.ExrateList.Exrate.map((exrate) => ({
             CurrencyCode: exrate.$.CurrencyCode,
             CurrencyName: exrate.$.CurrencyName,
             Buy: exrate.$.Buy,
             Transfer: exrate.$.Transfer,
             Sell: exrate.$.Sell,
           })),
           Source: result.ExrateList.Source[0],
         };

         const USD = json.Exrate.find((x) => x.CurrencyCode === "USD");

         let USDPriceString = USD.Transfer;
         USDPriceString = USDPriceString.replace(/[^0-9.,]/g, "");
         USDPriceString = USDPriceString.replace(",", ".");
         let number = parseFloat(USDPriceString);

         resolve(number * 1000 * Number(price));
       });
     });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const convertVNDtoUSD = async (price) => {
  try {
    const response = await axios.get(
      "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10"
    );

    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          reject(err); // Reject the promise on error
          return;
        }

        const json = {
          DateTime: result.ExrateList.DateTime[0],
          Exrate: result.ExrateList.Exrate.map((exrate) => ({
            CurrencyCode: exrate.$.CurrencyCode,
            CurrencyName: exrate.$.CurrencyName,
            Buy: exrate.$.Buy,
            Transfer: exrate.$.Transfer,
            Sell: exrate.$.Sell,
          })),
          Source: result.ExrateList.Source[0],
        };

        const USD = json.Exrate.find((x) => x.CurrencyCode === "USD");

        let USDPriceString = USD.Transfer;
        USDPriceString = USDPriceString.replace(/[^0-9.,]/g, "");
        USDPriceString = USDPriceString.replace(",", ".");
        let number = parseFloat(USDPriceString);

        resolve(Number(price) / (number * 1000));
      });
    });

    
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  compareSymbols,
  fetchEPS,
  fetchMarketCap,
  fetchNews,
  fetchOverview,
  fetchPrice,
  fetchRecommendation,
  fetchStockPeers,
  fetchListCrypto,
  findAllStock,
  getPriceGold,
  getForeignCurrency,
  findStockDetail,
  convertVNDtoUSD,
  convertUSDToVND,
};
