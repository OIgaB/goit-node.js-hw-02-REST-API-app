import { HttpError } from '../helpers/index.js';

const isEmptyBody = (req, res, next) => {
    const { length } = Object.keys(req.body); // повертається масив ключів
    // body - це об'єкт і якщо в ньому немає властивостей/ключів, то він пустий
    if(!length) { // якщо немає властивостей
        next(HttpError(400, 'There are no fields in the body'));
    }
    next();
}

export default isEmptyBody;


// patch: Якщо body немає, повертає json з ключем {"message": "missing field favorite"} і статусом 400