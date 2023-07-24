import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app.js';

const { DB_HOST, PORT = 3000 } = process.env;

dotenv.config(); // метод config() шукає текстовий файл .env і додає з нього секретні дані у змінні оточення {ключ: значення}
                 //  тобто у налаштування компютера (process.env)

mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)    // підключення до БД
  .then(() => {
    app.listen(PORT)    // запуск веб-сервера тільки у випадку, якщо змогли підключитися до БД
    console.log(`Database connection successful. Server running on port: ${PORT}`);
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1); // якщо до з'єднання з БД було щось запущено, то ця команда примусово закриє запущений процес з 1 (= з невідомою помилкою) 
  })