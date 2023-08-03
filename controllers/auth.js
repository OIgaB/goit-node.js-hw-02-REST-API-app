import bcrypt from 'bcrypt';  // пакет для хешування (працює асинхронно)
import jwt from 'jsonwebtoken'; // пакет для створення токету
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import { User } from '../models/user.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const { SECRET_KEY } = process.env; // беремо секретний ключ у змінних оточеннях


const register = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email}); // чи є в БД користувач з таким email (знаходить перше співпадіння і повертає дані або null)
    if(user) {
        throw HttpError(409, 'Email already in use'); // якщо викидається помилка, код завжди приривається
    }
    const hashPassword = await bcrypt.hash(password, 10); //перед тим як зберегти пароль в БД, хешуємо його
    // 10 - сіль - набір випадкових символів - складність алгоритму генерації солі
    
    const avatarURL = gravatar.url(email); // генеруємо посилання на тимчасову аватарку
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL }) // в БД зберігаємо пароль у захешованому вигляді (post-запит)
    
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,            
        }
    })
};

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email or password invalid'); //більш безпечний варіант писати ...або..., а не один email
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
    console.log('this is logout');

    res.status(204).json({
        message: 'Logout success' // повідомлення чомусь не відображається
    });
}

const updateSubscription = async(req, res) => { 
    const { _id } = req.user;
    console.log('req.user:', req.user);
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true }); //patch-запит (коригування значення підписки)
    console.log("result в updateSubscription:", result);
    if(!result) {
      throw HttpError(404, `User with id=${_id} not found`); 
    }
    res.json(result);  // статус 200 повертається автоматично
};


const avatarPath = path.resolve("public", "avatars"); // шлях до папки з файлом

const updateAvatar = async(req, res) => {
    const { _id } = req.user; // new ObjectId("64c6f0e733523b6f5a4ba4b8"),

    const { path: oldPath, filename } = req.file; //  path до temp; filename - нова назва файлу
    const newPath = path.join(avatarPath, filename); // створюємо новий шлях з ім'ям файлу
    await fs.rename(oldPath, newPath); // переміщення файла
    const avatarURL = path.join('avatars', filename); // записуємо шлях в body // папку 'public' не пишемо, вона вже вказана в мідлварі в app.js
  
    await Contact.findByIdAndUpdate(_id, {avatarURL}); // знаючи id користувача, можемо перезаписати avatarURL
    // {
    //   name: 'Zoi Doich',
    //   email: 'nulla.ante@rl.co.uk',
    //   phone: '(992) 914-3792',
    //   favorite: false,
    //   owner: new ObjectId("64c6f0e733523b6f5a4ba4b8"),
    //   _id: new ObjectId("64c72713f9d52ec1573daf63"),
    //   createdAt: 2023-07-31T03:14:27.161Z,
    //   updatedAt: 2023-07-31T03:14:27.161Z
    // }
    res.status(201).json({avatarURL}); // успішно додали контакт на сервер
}

export default { //огортаємо все в try/catch
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent), //тут ми не викидаємо помилку, але для універсальності
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}