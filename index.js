const express = require('express');
const app = express();
const morgan = require('morgan')
const PORT = 3000
const pkg = require('./package.json');
const { handleMessage } = require('./controller/messagehandler');
const { startTelegramPlatform } = require('./platform/telegram');
const { startLinePlatform } = require('./platform/line');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// middleware
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(morgan('Aaron'));
morgan.format('Aaron', '[Aaron] :method :url :status');
morgan.token('from', function(req, res){
    return req.query.from || '-';   
})

// app index
app.get("*", async (req,res) => {
    res.status(200).json({
        "name": pkg.name,
        "version": pkg.version
    })
})

startTelegramPlatform({
    token: TELEGRAM_BOT_TOKEN,
    onMessage: handleMessage,
});

if (LINE_CHANNEL_SECRET && LINE_CHANNEL_ACCESS_TOKEN) {
    startLinePlatform({
        app,
        channelSecret: LINE_CHANNEL_SECRET,
        channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
        onMessage: handleMessage,
        webhookPath: '/webhook/line',
    });
}

app.listen(PORT, () => {
    console.log(`伺服器啟動在 http://localhost:${PORT}`)
})