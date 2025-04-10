const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Настройка CORS
app.use(cors({
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Парсинг JSON
app.use(express.json());

// Проверка переменных окружения
if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
    console.error('ERROR: Отсутствуют BOT_TOKEN или CHAT_ID');
    process.exit(1);
}

// Обработчик OPTIONS
app.options('*', (req, res) => res.status(200).end());

// Основной обработчик
app.post('/', async (req, res) => {
    try {
        // Валидация данных
        const { name, email, comment } = req.body;
        if (!name || !email || !comment) {
            return res.status(400).json({
                error: 'Необходимо заполнить все поля'
            });
        }

        // Форматирование сообщения
        const message = `📨 Новое сообщение с сайта:
👤 Имя: ${name}
📧 Email: ${email}
💬 Комментарий: ${comment}`;

        // Отправка в Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            },
            { timeout: 5000 }
        );

        // Успешный ответ
        res.status(200).json({
            success: true,
            messageId: telegramResponse.data.result.message_id
        });

    } catch (error) {
        console.error('Ошибка Telegram API:', error.response?.data || error.message);
        
        res.status(500).json({
            error: 'Ошибка при отправке сообщения',
            details: error.response?.data || {}
        });
    }
});

module.exports = app;