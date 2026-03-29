const express = require('express');
const app = express();
const morgan = require('morgan')
const PORT = process.env.PORT || 3000
const pkg = require('./package.json');
const { handleMessage } = require('./controller/messagehandler');
const { startTelegramPlatform } = require('./platform/telegram');
const { startLinePlatform } = require('./platform/line');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
morgan.format('Aaron', '[Aaron] :method :url :status');
morgan.token('from', function(req, res){
    return req.query.from || '-';   
})
app.use(morgan('Aaron'));
app.get("*", async (req,res) => {
    res.status(200).json({
        "name": pkg.name,
        "version": pkg.version
    })
})

if (TELEGRAM_BOT_TOKEN) {
    startTelegramPlatform({
        token: TELEGRAM_BOT_TOKEN,
        onMessage: handleMessage,
    });
} else {
    console.warn('TELEGRAM_BOT_TOKEN 未設定，略過 Telegram 平台啟動');
}

if (!LINE_CHANNEL_SECRET || !LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn('LINE 設定不完整，webhook 仍會啟用以回應 200；請補齊 LINE_CHANNEL_SECRET 與 LINE_CHANNEL_ACCESS_TOKEN');
}

startLinePlatform({
    app,
    channelSecret: LINE_CHANNEL_SECRET,
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
    onMessage: handleMessage,
    webhookPath: '/webhook/line',
});

app.listen(PORT, () => {
    console.log(`伺服器啟動在 http://localhost:${PORT}`)
})