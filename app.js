import express from 'express';
import logger from 'morgan'; //пакет щоб логувати (виводити в консоль) запити - наприклад, для дебагінгу
import cors from 'cors';
import contactsRouter from './routes/api/contacts.js'; // імпорт маршрутів (окремої сторінки записної книги)

const app = express(); // створили веб-сервер

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short' 
// в режимі розробки виводиться повна інфо., а в режимі продакшина - коротка


app.use(logger(formatsLogger)) // повертає middleware
app.use(cors())               // повертає middleware 
app.use(express.json()) // перевіряє чи є тіло запиту, його тип (по заголовку Content-Type)... 
// якщо це application/json, то мідлвара буде рядком. JSON.parse перетворить формат тіла запиту на об'єкт 

app.use('/api/contacts', contactsRouter)   
// якщо прийде запит, який починається з '/api/contacts', то обробник цього запиту шукай в contactsRouter


// спільні для всіх запитів middleware 

app.use((req, res) => {   
  res.status(404).json({ message: 'Not found' })  
}) // якщо прийшов запит на адресу, якої немає, перетвори отриману від express html-розмітку на json і відправ відповідь

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app;