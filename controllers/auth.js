import bcrypt from 'bcrypt';  // пакет для хешування (працює асинхронно)
import jwt from 'jsonwebtoken'; // пакет для створення токету
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import Jimp from "jimp";  //image processing library for Node.js (resizing, cropping, applying filters...)
import { nanoid } from 'nanoid';
import { User } from '../models/user.js';
import { HttpError, sendEmail } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const { SECRET_KEY, BASE_URL } = process.env; // беремо секретний ключ у змінних оточеннях


const register = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email}); // чи є в БД користувач з таким email (знаходить перше співпадіння і повертає дані або null)
    if(user) {
        throw HttpError(409, 'Email already in use'); // якщо викидається помилка, код завжди приривається
    }
    const hashPassword = await bcrypt.hash(password, 10); //перед тим як зберегти пароль в БД, хешуємо його
    // 10 - сіль - набір випадкових символів - складність алгоритму генерації солі
    
    const avatarURL = gravatar.url(email); // генеруємо посилання на тимчасову аватарку по email-у користувача
    const verificationToken = nanoid();
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken }) // в БД зберігаємо пароль у захешованому вигляді (post-запит)
    
    const verifyEmail = {
        to: email, // кому буде приходити email на підтвердження (можна використати тимчасову пошту на https://temp-mail.org/uk/)
        subject: 'Verify email 7',
        html: `<a target='_blank' href="${BASE_URL}/api/auth/verify/${verificationToken}">Let's verify your email so you can start login. Click here to verify.</a>`
    } // при переході за посиланням спрацьовує GET-запит

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,    
            avatarURL: newUser.avatarURL,        
        }
    })
};

// Зміна статусу email-у на "верифікований" та очищення верифікаційного коду в БД після підтвердження пошти в отриманому листі
const verifyEmail = async(req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken }); // перевіряємо чи є в БД користувач з таким кодом
    if(!user) {
        throw HttpError(401, 'Email is not found')
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" }); // якщо є такий користувач, то вносимо зміни до БД

    res.json({
        message: "Congratulations! The email has been successfully verified."
    })
};

const resendVerifyEmail = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        throw HttpError(401, 'Email is not found');
    }
    if(user.verify) { //якщо користувач вже підтвердив email (user.verify = true)
        throw HttpError(401, 'The email is already verified')   // не спрацює, бо спочатку Postman видасть "Email already in use"
    }
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target='_blank' href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Let's verify your email so you can start login. Click here to verify.</a>`,
    };
    await sendEmail(verifyEmail); //якщо користувач ще не підтвердив email

    res.json({
        message: 'Congratulations! The email has been successfully verified.'
    })
}

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email or password invalid'); //більш безпечний варіант писати ...або..., а не один email
    }
    if(!user.verify) { //якщо користувач не підтвердив email (user.verify = false)
        throw HttpError(401, 'Email not verified')
    }
    const passwordCompare = await bcrypt.compare(password, user.password); //порівнюємо введений пароль з тим, що є в БД (true/false)
    if(!passwordCompare) { //якщо false
        throw HttpError(401, 'Email or pasword invalid');
    }
    const payload = {
        id: user._id,
    };
    //якщо паролі співпадають, то створюємо токен (метод sign())
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'}); //без expiresIn токен житиме вічно
    await User.findByIdAndUpdate(user._id, {token}); // записуємо в БД токен користувача, який хоче залогінитися //put/putch-запит

    res.json({
        token, // відправляємо на фронтенд токен
        "user": {
            "email": email,
            "subscription": user.subscription,
        }
    })
};

const getCurrent = async(req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    })
};

const logout = async(req, res) => {
    const {_id} = req.user; // беремо id користувача, який хоче розлогінитися  
    await User.findByIdAndUpdate(_id, {token: ""});   //put-запит

    res.status(204).json({
        message: 'Logout success' // повідомлення чомусь не відображається
    });
}

const updateSubscription = async(req, res) => { 
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true }); //patch-запит (коригування значення підписки)
    if(!result) {
      throw HttpError(404, `User with id=${_id} not found`); 
    }
    res.json(result);  // статус 200 повертається автоматично
};


const avatarPath = path.resolve("public", "avatars"); // шлях до папки з файлом

const updateAvatar = async(req, res) => {
    const { _id } = req.user; // new ObjectId("64c6f0e733523b6f5a4ba4b8"),
    const { path: oldPath, filename } = req.file; //  path до temp; filename - нова назва файлу

    const newPath = path.join(avatarPath, filename); // створюємо новий шлях (до public\avatars) з ім'ям файлу
    //newPath = C:\Users\Olga\Desktop\GitHub\goit-node.js-hw-02-REST-API-app\public\avatars\1691116545855-256001994_drink.jpg

    Jimp.read(oldPath)
        .then(image => {
            return image
            .resize(250, 250) // resize
            // .resize(Jimp.AUTO, 250)  //ширина відповідно
            //.resize(250, Jimp.AUTO)   // висота відповідно
            // .quality(60) // set JPEG quality
            // .greyscale() // чорно-білий знімок
            .write(newPath); // зберігає оброблене зображ. за вказаним маршрутом (до public\avatars), але не видаляє з temp оригінальне
        })
        .catch(err => {
            console.error(err);
        });  

    await fs.rename(oldPath, newPath); // переміщення файла до public\avatars  (переміщення вже було реалізоване в Jimp), + видалення з temp оригінального

    const avatarURL = path.join('avatars', filename); // записуємо шлях в body // папку 'public' не пишемо, вона вже вказана в мідлварі в app.js
    // avatarURL: avatars\1691116849916-469261661_drink.jpg

    await User.findByIdAndUpdate(_id, {avatarURL}); // знаючи id користувача, можемо перезаписати avatarURL


    res.status(201).json({avatarURL}); // успішно додали контакт на сервер
}

export default { //огортаємо все в try/catch
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent), //тут ми не викидаємо помилку, але для універсальності
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}