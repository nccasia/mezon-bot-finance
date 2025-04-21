const dotenv = require("dotenv");
const { MezonClient } = require("mezon-sdk");
const {
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
} = require("./apis");
const { getAllCoins, getCoinDetails } = require("./apicoin");

dotenv.config();

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN);
  await client.authenticate();
  client.on("channel_message", async (event) => {
    if (event?.content?.t === "*ping") {
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: "pong" },
        [],
        [],
        [
          {
            message_id: "",
            message_ref_id: event.message_id,
            ref_type: 0,
            message_sender_id: event.sender_id,
            message_sender_username: event.username,
            mesages_sender_avatar: event.avatar,
            message_sender_clan_nick: event.clan_nick,
            message_sender_display_name: event.display_name,
            content: JSON.stringify(event.content),
            has_attachment: false,
          },
        ]
      );
    }

    if (event?.content?.t.startsWith("*cp ")) {
      try {
        const symbol = event.content.t.slice(4).trim();
        const data = await findStockDetail(symbol);
        console.log(data);
        let output = `
          Thông tin về cổ phiếu ${data.code} (${data.type}):
          - Tên công ty: ${data.name}
          - Giá hiện tại: ${data.currentPrice} VND
          - Biến động giá: ${data.priceChange}
          - Giá thấp nhất: ${data.minPrice} VND
          - Giá cao nhất: ${data.maxPrice} VND
          - Vốn hóa thị trường: ${data.capitalization}
          - Chỉ số P/E: ${data.pe}
          - EPS: ${data.eps}
          - Khối lượng giao dịch: ${data.tradingVolume}
          - P/B: ${data.pb}
          - Giá trị sổ sách: ${data.bookValue} VND
          - Số lượng cổ phiếu lưu hành: ${data.numberOfOutstandingShares}
          - EV: ${data.ev}
          - Chất lượng kinh doanh: ${data.businessQuality}
          - Mức độ rủi ro: ${data.risk}

          Giới thiệu:
          ${data.introduce}
`;
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: output },
          [],
          [
            {
              url: data.icon || "default-image-url.jpg",
              filetype: "image/jpeg",
            },
          ],
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (event?.content?.t === "*cp") {
      try {
        const data = await findAllStock();
        let table = `| ${"Mã cổ phiếu".padEnd(12)} | ${"Vốn hóa".padEnd(
          8
        )} | ${"Biến động giá".padEnd(14)} | ${"P/E".padEnd(
          8
        )} | ${"7 Ngày".padEnd(12)} | ${"Ngành".padEnd(15)} |\n`;
        table += `|${"-".repeat(12 + 2)}|${"-".repeat(8 + 2)}|${"-".repeat(
          14 + 2
        )}|${"-".repeat(8 + 2)}|${"-".repeat(12 + 2)}|${"-".repeat(15 + 2)}|\n`;

        Object.values(data).forEach((item) => {
          table += `| ${item.code.padEnd(12)} | ${item.currentPrice.padEnd(
            8
          )} | ${item.priceChange.padEnd(14)} | ${item.peRatio.padEnd(
            8
          )} | ${item.change7Days.padEnd(12)} | ${item.industry.padEnd(
            15
          )} |\n`;
        });

        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: table },
          [],
          [],
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: false,
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (event?.content?.t.startsWith("*price ")) {
      const symbol = event.content.t.slice(7).trim();
      const data = await fetchPrice(symbol);
      console.log(data);
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: `Giá hiện tại của ${symbol} là: ${data} VND` }
      );
    }

    if (event?.content?.t.startsWith("*cap ")) {
      const symbol = event.content.t.slice(5).trim();
      const data = await fetchMarketCap(symbol);
      console.log("vốn hóa ", data);
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: `Vốn hóa thị trường của ${symbol}: ${data} VND` }
      );
    }

    if (event?.content?.t.startsWith("*peers ")) {
      const symbol = event.content.t.slice(7).trim();
      const data = await fetchStockPeers(symbol);

      if (data && data.length > 0) {
        const peers = data.join(", ");
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: `Công ty cùng ngành với ${symbol}: ${peers}` }
        );
      } else {
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: `Không tìm thấy công ty nào cùng ngành với ${symbol}.` }
        );
      }
    }

    if (event?.content?.t.startsWith("*news ")) {
      const parts = event.content.t.split(" ");
      const symbol = parts[1]; // Assume the symbol is the second word
      const fromDate = parts[2] || "2024-10-29"; // Default fromDate if not provided
      const toDate = parts[3] || new Date().toISOString().split("T")[0]; // Default to today

      const news = await fetchNews(symbol, fromDate, toDate);
      console.log("news", news);

      if (news.length > 0) {
        const message = news
          .slice(0, 4)
          .map((n) => {
            return (
              `${n.headline}\n` +
              `Category: ${n.category}\n` +
              `Source: ${n.source}\n` +
              `Date: ${new Date(n.datetime * 1000).toLocaleDateString()}\n` +
              `Summary: ${n.summary}\n` +
              `Link: [Read more](${n.url})\n` +
              `\n---\n`
            );
          })
          .join("\n");
        const attachments = news
          .slice(0, 4)
          .map((n) => ({
            url: n.image || "default-image-url.jpg",
            filetype: "image/jpg",
          }))
          .filter((attachment) => attachment.url);

        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          {
            t: `Tin tức về ${symbol} từ ${fromDate} đến ${toDate}:\n${message}`,
          },
          [],
          attachments,
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              message_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } else {
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          {
            t: `Không tìm thấy tin tức cho ${symbol} trong khoảng thời gian này.`,
          }
        );
      }
    }

    if (event?.content?.t.startsWith("*eps ")) {
      const symbol = event.content.t.slice(5).trim();
      const data = await fetchEPS(symbol);
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: `EPS của ${symbol} là: ${data}` }
      );
    }

    if (event?.content?.t.startsWith("*compare ")) {
      const [symbol1, symbol2] = event.content.t.slice(9).trim().split(" ");
      const comparison = await compareSymbols(symbol1, symbol2);
      console.log(comparison);
      const comparisonString = Object.entries(comparison)
        .map(([symbol, value]) => `${symbol}: ${value.toLocaleString()} VND`)
        .join("\n");
      const message = `So sánh ${symbol1} và ${symbol2}:\n${comparisonString}`;
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: message }
      );
    }
    if (event?.content?.t === "*crypto") {
      try {
        const data = await fetchListCrypto();
        const cryptoExchangesMessage = `
      Danh sách sàn giao dịch tiền mã hóa:
      ${data.join("\n")}
    `;

        // Send the message back to the user
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: cryptoExchangesMessage }
        );
      } catch (error) {
        console.error("Error fetching crypto list:", error);
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: "Có lỗi xảy ra khi lấy danh sách sàn giao dịch." }
        );
      }
    }

    if (event?.content?.t === "*help") {
      const helpMessage = `
    Danh sách các lệnh có sẵn:
- *ping: Kiểm tra trạng thái của bot
- *cp <symbol>: Thông tin chi tiết về cổ phiếu hoặc tiền mã hóa
- *price <symbol>: Giá hiện tại của cổ phiếu hoặc tiền mã hóa
- *cap <symbol>: Vốn hóa thị trường của cổ phiếu hoặc tiền mã hóa
- *peers <symbol>: Danh sách các cổ phiếu hoặc tiền mã hóa cùng ngành
- *news <symbol>: Tin tức liên quan đến cổ phiếu hoặc tiền mã hóa
- *compare <symbol1> <symbol2>: So sánh hai mã cổ phiếu hoặc tiền mã hóa
- *about: Giới thiệu về bot
- *overview <symbol>: Thông tin tổng quan về cổ phiếu hoặc tiền mã hóa
- *recommend <symbol>: Đề xuất cổ phiếu hoặc tiền mã hóa
- *crypto : Danh sách các sàn giao dịch tiền mã hóa
- *gold : Giá vàng
- *currency : Giá ngoại tệ
- *vndtousd <amount>: Chuyển đổi VND sang USD
- *usdtovnd <amount>: Chuyển đổi USD sang VND
- *coins : Danh sách tiền mã hóa
- *coins <symbol>: Thông tin chi tiết về tiền mã hóa
  `;
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: helpMessage }
      );
    }

    if (event?.content?.t === "*about") {
      const aboutMessage = `
    Bot Cổ Phiếu & Tiền Mã Hóa
    Chức năng: Theo dõi giá, tin tức, khối lượng giao dịch và so sánh cổ phiếu và coin.
    API hỗ trợ bởi dữ liệu thị trường và các chỉ số tài chính.
  `;
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: aboutMessage }
      );
    }

    if (event?.content?.t.startsWith("*overview ")) {
      const identifier = event.content.t.slice(9).trim();

      let type = "symbol";
      if (/^[A-Z]{1,5}$/.test(identifier)) {
        type = "symbol";
      } else if (/^US\d{10}$/.test(identifier)) {
        type = "isin";
      } else if (/^\d{9}$/.test(identifier)) {
        type = "cusip";
      } else {
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          {
            t: "Invalid identifier format. Please provide a valid stock symbol, ISIN, or CUSIP.",
          }
        );
        return;
      }

      try {
        const stockProfile = await fetchOverview(identifier, type);
        const message = `
      **Stock Profile: ${stockProfile.name} (${stockProfile.ticker})**
      - **Country:** ${stockProfile.country}
      - **Exchange:** ${stockProfile.exchange}
      - **Industry:** ${stockProfile.finnhubIndustry}
      - **Market Capitalization:** $${(
        stockProfile.marketCapitalization / 1e6
      ).toLocaleString()} Billion
      - **IPO Date:** ${new Date(stockProfile.ipo).toLocaleDateString()}
      - **Outstanding Shares:** ${stockProfile.shareOutstanding.toLocaleString()} Million
      - **Currency:** ${stockProfile.currency}
      - **Contact Phone:** ${stockProfile.phone}
      - **Website:** [Visit Website](${stockProfile.weburl})
    `;
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,

          { t: message },
          [],
          [
            {
              url: stockProfile.logo || "default-image-url.jpg",
              filetype: "image/jpg",
            },
          ],
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } catch (error) {
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          {
            t: `Unable to fetch overview for ${identifier}. Please try again later.`,
          }
        );
      }
    }

    if (event?.content?.t.startsWith("*recommend ")) {
      const symbol = event.content.t.slice(11).trim();
      const recommendation = await fetchRecommendation(symbol);
      const message = recommendation
        .map((rec) => {
          return `
              **Recommendations for ${rec.symbol} (Period: ${rec.period}):**
              - Strong Buy: ${rec.strongBuy}
              - Buy: ${rec.buy}
              - Hold: ${rec.hold}
              - Sell: ${rec.sell}
              - Strong Sell: ${rec.strongSell}
              `;
        })
        .join("\n");
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: `Khuyến nghị cho ${symbol}:\n ${message}` }
      );
    }

    if (event?.content?.t === "*gold") {
      try {
        const data = await getPriceGold();
        const goldPricesMessage = `
      Giá vàng:
      - SJC Hà Nội: Mua vào ${data.sjcHN.buy} - Bán ra ${data.sjcHN.sell}
      - SJC Hồ Chí Minh: Mua vào ${data.sjcHCM.buy} - Bán ra ${data.sjcHCM.sell}
      - SJC Đà Nẵng: Mua vào ${data.sjcDN.buy} - Bán ra ${data.sjcDN.sell}
      - Vàng 9999 Hà Nội: Mua vào ${data["9999-HN"].buy} - Bán ra ${data["9999-HN"].sell}
      - Vàng 999 Hà Nội: Mua vào ${data["999-HN"].buy} - Bán ra ${data["999-HN"].sell}
    `;
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: goldPricesMessage }
        );
      } catch (error) {
        console.error("Error fetching crypto list:", error);
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: "Có lỗi xảy ra khi lấy danh sách sàn giao dịch." }
        );
      }
    }

    if (event?.content?.t === "*currency") {
      try {
        const data = await getForeignCurrency();
        let table = `| ${"Currency Code".padEnd(12)} | ${"Currency Name".padEnd(
          18
        )} | ${"Buy".padStart(10)} | ${"Transfer".padStart(
          10
        )} | ${"Sell".padStart(10)} |\n`;
        table += `|${"-".repeat(14)}|${"-".repeat(20)}|${"-".repeat(
          12
        )}|${"-".repeat(12)}|${"-".repeat(12)}|\n`;

        Object.values(data).forEach((item) => {
          table += `| ${item.CurrencyCode.padEnd(
            12
          )} | ${item.CurrencyName.padEnd(18)} | ${item.Buy.padStart(
            10
          )} | ${item.Transfer.padStart(10)} | ${item.Sell.padStart(10)} |\n`;
        });

        console.log(table);
        // Send the message back to the user
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: table }
        );
      } catch (error) {
        console.error("Error fetching crypto list:", error);
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: "Có lỗi xảy ra khi lấy danh sách sàn giao dịch." }
        );
      }
    }

    if (event?.content?.t.startsWith("*vndtousd ")) {
      try {
        const symbol = event.content.t.slice(10).trim();
        const data = await convertVNDtoUSD(symbol);
        const formattedData = data.toLocaleString("en-US");
        // Tạo thông điệp
        const message = `Chuyển đổi ${symbol} VND sang USD: ${formattedData} $`;
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: message },
          [],
          [],
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (event?.content?.t.startsWith("*usdtovnd ")) {
      try {
        const symbol = event.content.t.slice(10).trim();
        const data = await convertUSDToVND(symbol);
        // Định dạng data với dấu phẩy
        const formattedData = data.toLocaleString("en-US");

        // Tạo thông điệp
        const message = `Chuyển đổi ${symbol} USD sang VND: ${formattedData} VNĐ`;
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: message },
          [],
          [],
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (event?.content?.t === "*coins") {
      try {
        const data = await getAllCoins();
        const response = `
          Danh sách các giao dịch coins:
            ${data.join("\n")}
          `;

        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: response }
        );
      } catch (error) {
        console.error("Error fetching crypto list:", error);
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: "Có lỗi xảy ra khi lấy danh sách sàn giao dịch." }
        );
      }
    }

    if (event?.content?.t.startsWith("*coins ")) {
      try {
        const symbol = event.content.t.slice(7).trim();
        const coin = await getCoinDetails(symbol);

        const message = `
    Thông tin ${coin.symbol}:
    - Giá thay đổi: ${coin.priceChange}
    - Phần trăm thay đổi giá: ${coin.priceChangePercent}%
    - Giá trung bình: ${coin.weightedAvgPrice}
    - Giá mở cửa: ${coin.openPrice}
    - Giá cao nhất: ${coin.highPrice}
    - Giá thấp nhất: ${coin.lowPrice}
    - Giá cuối cùng: ${coin.lastPrice}
    - Số lượng cuối cùng: ${coin.lastQty}
    - Giá bid: ${coin.bidPrice} (Số lượng: ${coin.bidQty})
    - Giá ask: ${coin.askPrice} (Số lượng: ${coin.askQty})
    - Khối lượng giao dịch: ${coin.volume}
    - Khối lượng quote: ${coin.quoteVolume}
    - Thời gian mở cửa: ${new Date(coin.openTime).toLocaleString()}
    - Thời gian đóng cửa: ${new Date(coin.closeTime).toLocaleString()}
    - Số giao dịch: ${coin.count}
  `;

        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: message },
          [],
          [],
          [
            {
              message_id: "",
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  });
}

main()
  .then(() => {
    console.log("bot start!");
  })
  .catch((error) => {
    console.error(error);
  });
