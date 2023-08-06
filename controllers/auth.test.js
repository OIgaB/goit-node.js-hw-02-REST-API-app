 import mongoose from 'mongoose';
 import request from 'supertest'; // робить http-запит на бекенд
 import 'dotenv/config'; // метод config() шукає текстовий файл .env і додає з нього секретні дані у змінні оточення {ключ: значення}
 //  тобто у налаштування компютера (process.env)


 import app from '../app.js'; // імпортуємо веб-сервер
 import { User } from '../models/user.js';  // імпортуємо модель

 const { PORT_TEST, DB_HOST } = process.env;


 describe("test login route", ()=> { //створюємо групу тестів
    // Перед тестуванням запустимо проєкт (приєднаємось до БД і запустимо сервер).
    // Закінчивши тестування, все закриємо

    let server = null;

    // спрацює перед всіма тестами
    beforeAll(()=> {
        mongoose.connect(DB_HOST)    // підключення до БД
        .then(
            server = app.listen(PORT_TEST)  // запускаємо сервер (повертає посилання на активний сервер)
        )
        .catch(error => {
            console.log(error.message);
            process.exit(1); // якщо до з'єднання з БД було щось запущено, то ця команда примусово закриє запущений процес з 1 (= з невідомою помилкою) 
        })
    })

    // спрацює після всіх тестів
    afterAll(()=> {
        mongoose.connection.close()  // відключаємося від БД
        .then(
            server.close() // закриваємо сервер
        )    
        .catch(error => {
            console.log(error.message);
            process.exit(1); // якщо до з'єднання з БД було щось запущено, то ця команда примусово закриє запущений процес з 1 (= з невідомою помилкою) 
        })       
    })

// -------------------- unit-тести для контролера входу (логін) ----------------------------
// відповідь повина мати статус-код 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

    test("test login with correct data", async()=> {
        const loginData = {
            "email": "example2@example.com",
            "password": "example2password"
        };
        const { statusCode, body } = await request(app).post("/api/auth/login").send(loginData);
        // body: {
        //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2Y5Y2RiM2RkMDNkMjhhZjc4M2E2YyIsImlhdCI6MTY5MTMyODE3NSwiZXhwIjoxNjkxNDEwOTc1fQ.ivDVrkh3CRk2Ohb4CNMYXUInkj5dPJ6yf3nLzEg6IRo',
        //     user: { email: 'example2@example.com', subscription: 'starter' }
        //   }
        expect(statusCode).toBe(200);
        expect(body.token).toBeDefined();  //toBeDefined() checks if the value is not undefined.

        expect(body.user.email).toBe(loginData.email);

        const user = await User.findOne({email: loginData.email}); // перевіряємо чи записалось в БД
        // user: {
        //     _id: new ObjectId("64cf9cdb3dd03d28af783a6c"),
        //     email: 'example2@example.com',
        //     password: '$2b$10...',
        //     subscription: 'starter',
        //     avatarURL: '//www.gravatar.com/avatar/b75a7dd26f16ae13b440190aef177ac1',
        //     token: 'eyJhb...',
        //     createdAt: 2023-08-06T13:15:07.342Z,
        //     updatedAt: 2023-08-06T13:19:51.164Z
        //   }
        expect(user.email).toBe(loginData.email);
        expect(typeof user.email).toBe('string');

        expect(body.user.subscription).toBeDefined();
        expect(typeof user.subscription).toBe('string');
    })

 })