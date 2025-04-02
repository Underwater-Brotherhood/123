const express = require('express');
const axios = require('axios');
const app = express();

app.use(require('cors')());
app.use(express.json());

app.post('/', async (req, res) => {
    try {
        const { name, email, comment } = req.body;
        
        // Проверка данных
        if (!name || !email || !comment) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }

        // Отправляем в Telegram
        await axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: `Новое сообщение:\nИмя: ${name}\nEmail: ${email}\nСообщение: ${comment}`
            }
        );

        res.json({ success: true });
        
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Ошибка отправки' });
    }
});

module.exports = app;