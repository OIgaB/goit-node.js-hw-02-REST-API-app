import express from 'express';
import logger from 'morgan'; //пакет щоб логувати (виводити в консоль) запити - наприклад, для дебагінгу
import cors from 'cors';


// імпорт маршрутів (окремі сторінки записної книги)
import authRouter from './routes/api/auth.js';
import contactsRouter from './routes/api/contacts.js'; 

const app = express(); // створили веб-сервер

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short' 
// в режимі розробки виводиться повна інфо., а в режимі продакшина - коротка

// middlewares
app.use(logger(formatsLogger)); 
app.use(cors());               
app.use(express.json()); // перевіряє чи є тіло запиту (для post/put запитів), його тип (по заголовку Content-Type)... 
                        // якщо це application/json, то мідлвара буде рядком. JSON.parse перетворить формат тіла запиту на об'єкт 
app.use(express.static('public')); // якщо прийде запит на статичний файл, шукай його в папці public і віддавай


// якщо прийде запит, який починається з '/api/...', то обробник цього запиту шукай в authRouter/contactsRouter
app.use('/api/auth', authRouter) 
app.use('/api/contacts', contactsRouter)   


// спільні для всіх запитів middleware 

app.use((req, res) => {    // наприклад, post-запит без id
  res.status(404).json({ message: 'Not found' })  
}) // якщо прийшов запит на адресу, якої немає, перетвори отриману від express html-розмітку на json і відправ відповідь


// усі помилки з файлу routes/api/contacts.js через next(error) потраплять сюди
app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  // res.status(500).json({ message: err.message })   // Contact with id=qdggE76Jtbfd9eWJHrss not found 
  res.status(status).json({ message })
})

export default app;