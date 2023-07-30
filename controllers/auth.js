import bcrypt from 'bcrypt';  // пакет для хешування (працює асинхронно)
import jwt from 'jsonwebtoken'; // пакет для створення токету
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
    const newUser = await User.create({...req.body, password: hashPassword}) // в БД зберігаємо пароль у захешованому вигляді (post-запит)
    
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
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
    await User.findByIdAndUpdate(user._id, {token}); // записуємо в БД токен користувача, який хоче залогінитися

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
    if(!email) {
        throw HttpError(401, 'Not authorized'); 
    }

    res.json({
        email,
        subscription,
    })
};

const logout = async(req, res) => {
    const {_id} = req.user; // беремо id користувача, який хоче розлогінитися
    if(!_id) {
        throw HttpError(401, 'Not authorized'); 
    }    
    await User.findByIdAndUpdate(_id, {token: ''});

    res.status(204).json({
        message: 'Logout success'
    })
}

export default { //огортаємо все в try/catch
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent), //тут ми не викидаємо помилку, але для універсальності
    logout: ctrlWrapper(logout),
}