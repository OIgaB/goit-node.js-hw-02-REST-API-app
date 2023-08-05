 import mongoose from 'mongoose';
 import request from 'supertest';
 import 'dotenv/config';
//  import { authCtrl } from './index.js';

 import app from '../app.js'; // імпортуємо веб-сервер
 import { User } from '../models/user.js';  // імпортуємо модель

//  const login = authCtrl.login;

 const { PORT, DB_HOST_TEST } = process.env;

 describe("test login route", () => { //створюємо групу тестів
    // Перед тестуванням запустимо проєкт (приєднаємось до БД і запустимо сервер).
    // Закінчивши тестування, все закриємо

    let server = null;

    // спрацює перед всіма тестами
    beforeAll(async()=> {
        await mongoose.connect(DB_HOST_TEST); // підписуємось до БД
        server = app.listen(PORT); // запускаємо сервер (повертає посилання на активний сервер)
    })

    // спрацює після всіх тестів
    afterAll(async()=> {
        await mongoose.connection.close(); // відключаємося від БД
        server.close(); // закриваємо сервер
    })

    // спрацює після кожного тесту
    afterEach(async()=> {
        await User.deleteMany({}); // видаляємо все
    })

// -------------------- unit-тести для контролера входу (логін) ----------------------------
// відповідь повина мати статус-код 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

    test("test login with correct data", async() => {
        const loginData = {
            "email": "example2@example.com",
            "password": "example2password"
        };
        const { statusCode, body } = await request(app).post("/api/auth/login").send(loginData);
        expect(statusCode).toBe(200);

        expect(body.email).toBe(loginData.email);

        const user = await User.findOne({email: loginData.email});
        expect(user.email).toBe(loginData.email);
        expect(user.password).toBe(loginData.password);
    })

 })