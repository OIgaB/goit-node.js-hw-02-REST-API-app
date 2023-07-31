import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const { SECRET_KEY } = process.env;

//завдяки цій мідлварі дізнаємося чи токен валідний і хто робить запит
const authenticate = async(req, res, next) => {
    const { authorization = '' } = req.headers; // всі заголовки
    //якщо токен не отримаємо, то authorization буде undefined, а split з undefined не зробиш -> зламається бекенд, тому = ''
    const [bearer, token] = authorization.split(" "); //split розділяє рядок на масив - результат дії authorization.split(" "): ['Bearer', 'e...']
    if(bearer !== 'Bearer') { // перевірка чи є слово Bearer
        next(HttpError(401));
    }
    try{
        // метод verify() може викинути помилку, тому код огорнули в try/catch
        //verify() викине помилку, якщо (1) токен не валідний(його шифрували не цим ключем) або (2) його термін придатності сплинув
        const { id } = jwt.verify(token, SECRET_KEY); //якщо токен валідний, то нам повертається payload (а в ньому лише id)
        // payload - це { id: '64c6e83be242242f51662c02', iat: 1690761690, exp: 1690844490 }
        const user = await User.findById(id); //знаходить користувача (об'єкт) по id, взятому з токена

        if(!user || !user.token || user.token !== token){
            next(HttpError(401)); // помилка ловиться в ctrlWrapper
        }
        req.user = user; // запишемо в об'єкт req того, хто робить запит (з будь-якого файла можемо його отримати, оск. об'єкт один на запит)
        next(); //в роутах виконується наступна ф-ція після authenticate
    } catch {
        next(HttpError(401));
    }
}

export default ctrlWrapper(authenticate);

