const express = require('express');
const app = express();
const { handleMessage } = require('./path/to/your/code'); // 引入你貼的這個檔案

app.use(express.json());

// 這裡假設你的 Bot Webhook 是接 POST 請求
app.post('/webhook', async (req, res) => {
    try {
        // 根據你使用的 Bot 框架，包裝成 handleMessage 需要的 context 格式
        const context = {
            text: req.body.message?.text, // 依據實際 Payload 調整
            reply: async (msg) => {
                // 這裡實作回傳訊息給使用者的邏輯，並回應給 Webhook 平台
                console.log("Reply:", msg);
            }
        };
        
        await handleMessage(context);
        res.status(200).send('OK');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// ⭐ 關鍵：一定要監聽 process.env.PORT，並且綁定 0.0.0.0
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});