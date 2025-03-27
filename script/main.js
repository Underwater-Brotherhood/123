// Убедитесь, что установили зависимости:
// npm install express axios dotenv cors

require('dotenv').config(); // Добавляем загрузку переменных окружения
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Добавляем CORS

const app = express();

// Middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Для парсинга JSON
app.use(express.urlencoded({ extended: true })); // Для form-data

// Проверяем наличие обязательных переменных
if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
  throw new Error('Не заданы BOT_TOKEN или CHAT_ID в .env файле!');
}

// Обработчик запроса
app.post('/send-to-telegram', async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    
    // Валидация данных
    if (!name || !email || !comment) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // Формируем сообщение
    const message = `
      🚀 Новое сообщение с сайта:
      👤 Имя: ${name}
      📧 Email: ${email}
      💬 Комментарий: ${comment}
    `;

    // Отправляем в Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }
    );

    res.status(200).json({ 
      status: 'success',
      telegramResponse: response.data 
    });

  } catch (error) {
    console.error('Ошибка:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.response?.data || error.message 
    });
  }
});

// Проверка работоспособности сервера
app.get('/healthcheck', (req, res) => {
  res.status(200).send('Server is running');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`BOT_TOKEN: ${process.env.BOT_TOKEN ? '***' : 'не задан'}`);
  console.log(`CHAT_ID: ${process.env.CHAT_ID ? '***' : 'не задан'}`);
});