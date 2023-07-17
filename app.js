import contactsRouter from './routes/api/contacts.js'; // імпорт маршрутів (окремої сторінки записної книги)

import express from 'express';
import logger from 'morgan';
import cors from 'cors';

const app = express(); // створили веб-сервер

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())     // повертає middleware 
app.use(express.json()) // перевіряє чи є тіло запиту, його тип (по заголовку Content-Type)... 
// якщо це application/json, то мідлвара буде рядком. json.parse перетворить формат тіла запиту на об'єкт 

app.use('/api/contacts', contactsRouter)   // усі маршрути, які починаються з '/api/contacts', знаходяться в contactsRouter


// спільні для всіх запитів middleware 

app.use((req, res) => {   
  res.status(404).json({ message: 'Not found' })  
}) // якщо прийшов запит на адресу, якої немає,  перетвори отриману від express html-розмітку на json і відправ відповідь

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app;