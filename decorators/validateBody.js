// в post та put-запитах (routs/api/contacts.js) відбувалося повторення дії - тіло запиту перевірялося по схемі.
// Тепер цей код в одному місці - тут

import { HttpError } from '../helpers/index.js';


const validateBody = schema => {  // отримує joi-схему (addSchema)
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body); //error: undefind, якщо валідація успішна
        //здійснюється перевірка полів об'єкту на відповідність addSchema - повертається об'єкт з результатами перевірки
        // одним з ключів цього об'єкту є error, значенням якого буде undefind, якщо валідація успішна
        if(error) { // якщо валідація повернула помилку, то це буде об'єкт помилки з властивістю message (вказано у чому саме проблема)
            next(HttpError(400, error.message));  // наприклад, якщо передати не повний об'єкт - "\"phone\" is required" 
        }
        next();
    }
    return func; // повертає ф-цію, яка робить валідацію
}

export default validateBody;