# ROC Airport Weather Bot

提供飛航相關天氣查詢的聊天機器人，支援 Telegram 與 LINE。

- Telegram: https://t.me/ROC_Airport_Weather_Bot
- LINE 官方帳號 ID: @912tfjhm

---

## 功能介紹

- 查詢機場基本資訊（ICAO）
- 查詢 METAR
- 查詢 TAF
- 查詢 AIRMET（decoded）
- 同一套指令邏輯，同時支援 Telegram 與 LINE Webhook

資料來源為 CheckWX API。

---

## 指令列表

在 Telegram 或 LINE 對話中可使用以下指令：

- `/start`：顯示說明
- `/airport ICAO`：查詢機場資訊
- `/metar ICAO`：查詢 METAR
- `/taf ICAO`：查詢 TAF
- `/airmet ICAO`：查詢 AIRMET
- `/dev`：顯示開發者資訊

範例：

- `/airport RCTP`
- `/metar RJTT`
- `/taf RKSI`

---

## 技術堆疊

- Node.js
- Express
- node-telegram-bot-api（Telegram polling）
- LINE Messaging API（Webhook）
- Axios

---

## 專案結構

```text
.
├── index.js
├── controller/
│   └── messagehandler.js
├── platform/
│   ├── telegram.js
│   └── line.js
├── service/
│   └── weatherService.js
├── Dockerfile
└── zeabur.yaml
```

---

## 環境變數

請在執行前設定以下環境變數：

| 變數名稱 | 必填 | 說明 |
| --- | --- | --- |
| `CHECKWX_API_KEY` | 是 | CheckWX API Key |
| `TELEGRAM_BOT_TOKEN` | Telegram 使用時必填 | Telegram Bot Token |
| `LINE_CHANNEL_SECRET` | LINE 使用時必填 | LINE Channel Secret |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE 使用時必填 | LINE Channel Access Token |
| `PORT` | 否 | 服務埠號，預設 3000 |

說明：

- 若未設定 `TELEGRAM_BOT_TOKEN`，Telegram 平台會略過啟動。
- 若 LINE 金鑰未完整設定，LINE webhook 仍會回應 HTTP 200（用於部署健康檢查），但不會正常驗證與回覆。

---

## 本機啟動

1. 安裝相依套件

```bash
npm install
```

2. 設定環境變數（macOS / Linux 範例）

```bash
export CHECKWX_API_KEY="your_checkwx_key"
export TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
export LINE_CHANNEL_SECRET="your_line_channel_secret"
export LINE_CHANNEL_ACCESS_TOKEN="your_line_channel_access_token"
export PORT=3000
```

3. 啟動服務（開發）

```bash
npm start
```

預設會啟動在 `http://localhost:3000`。

---

## API 與 Webhook

- `GET *`：回傳專案名稱與版本資訊
- `POST /webhook/line`：LINE Webhook 入口

---

## Docker

建置映像：

```bash
docker build -t roc-airport-weather-bot .
```

啟動容器：

```bash
docker run --rm -p 3000:3000 \
	-e CHECKWX_API_KEY="your_checkwx_key" \
	-e TELEGRAM_BOT_TOKEN="your_telegram_bot_token" \
	-e LINE_CHANNEL_SECRET="your_line_channel_secret" \
	-e LINE_CHANNEL_ACCESS_TOKEN="your_line_channel_access_token" \
	roc-airport-weather-bot
```

---

## 部署備註（Zeabur）

專案包含 `zeabur.yaml`，啟動指令為：

```bash
npx nodemon index.js
```

建議在正式環境改用 `node index.js` 以降低不必要的監聽開銷。

---

## 聯絡資訊

- 開發者：Aaron
- GitHub：@ronkaotw
- Website：ronkao.tw
- LinkedIn：www.linkedin.com/in/ronkaotw

