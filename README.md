## Create your Mezon application

Visit the [Developers Portal](https://dev-developers.nccsoft.vn/) to create your application.

## Add bot to your clan

Use your install link in a browser to add your bot to your desired clan.

## Installation

```bash
$ yarn
```

Copy `.env.example` to `.env` and replace it with your application token.

## Running the app

```bash
# development
$ yarn start
```
# Hướng dẫn sử dụng bot

### Danh sách các lệnh có sẵn:

- `*ping`: Kiểm tra trạng thái của bot.
- `*cp <symbol>`: Lấy thông tin chi tiết về cổ phiếu hoặc tiền mã hóa.
- `*price <symbol>`: Xem giá hiện tại của cổ phiếu hoặc tiền mã hóa.
- `*cap <symbol>`: Xem vốn hóa thị trường của cổ phiếu hoặc tiền mã hóa.
- `*peers <symbol>`: Xem danh sách các cổ phiếu hoặc tiền mã hóa cùng ngành.
- `*news <symbol>`: Xem tin tức liên quan đến cổ phiếu hoặc tiền mã hóa.
- `*compare <symbol1> <symbol2>`: So sánh hai mã cổ phiếu hoặc tiền mã hóa.
- `*about`: Giới thiệu về bot.
- `*overview <symbol>`: Xem thông tin tổng quan về cổ phiếu hoặc tiền mã hóa.
- `*recommend <symbol>`: Đề xuất cổ phiếu hoặc tiền mã hóa.
- `*crypto`: Xem danh sách các sàn giao dịch tiền mã hóa.
- `*gold`: Xem giá vàng.
- `*currency`: Xem giá ngoại tệ.
- `*vndtousd <amount>`: Chuyển đổi VND sang USD.
- `*usdtovnd <amount>`: Chuyển đổi USD sang VND.
- `*coins`: Xem danh sách tiền mã hóa.
- `*coins <symbol>`: Xem thông tin chi tiết về tiền mã hóa.

### Cách sử dụng
Chỉ cần gõ lệnh vào khung chat theo định dạng như trên, 
ví dụ: 
- `*vndtousd 1000000` để chuyển đổi 1,000,000 VND sang USD.
- `*cp MBB` để lấy thông tin cổ phiếu MB BANK
- `*coins` BNBBTC lấy Thông tin BNBBTC
- `*price AAPL` Giá hiện tại của AAPL
Bot sẽ trả về thông tin tương ứng với lệnh bạn đã nhập. Hãy thử và khám phá các tính năng hữu ích của bot!
