const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Настройка CORS для всех доменов
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Парсинг JSON-тела запроса
app.use(express.json());

// Проверка обязательных переменных окружения при старте
const validateEnv = () => {
  if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
    console.error('ERROR: Missing required environment variables');
    process.exit(1);
  }
};
validateEnv();

// Обработчик для предварительных OPTIONS-запросов
app.options('*', (req, res) => {
  res.status(200).end();
});

// Основной обработчик запросов
app.post('/', async (req, res) => {
  try {
    // Валидация входных данных
    if (!req.body || !req.body.name || !req.body.email || !req.body.comment) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, comment'
      });
    }

    const { name, email, comment } = req.body;

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
      {
        timeout: 5000 // Таймаут 5 секунд
      }
    );

    // Успешный ответ
    res.status(200).json({
      success: true,
      telegramId: telegramResponse.data.result.message_id
    });

  } catch (error) {
    // Расширенная обработка ошибок
    console.error('Error:', error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.description 
      || 'Internal server error';

    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data || {}
    });
  }
});

// Экспорт приложения для Vercel
module.exports = app;