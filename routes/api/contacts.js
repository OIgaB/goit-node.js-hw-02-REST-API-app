import express from 'express';
import Joi from 'joi';  // бібліотека, що перевіряє тіло запиту
import contactsService from '../../models/contacts.js'; // імпорт усіх ф-цій для роботи з contacts.json
import { HttpError } from '../../helpers/index.js';

const router = express.Router(); // об'єкт, який описує окремі маршрути (створює 1 аркуш записної книжки)

// Створюємо Joi-схему для post/put-запитів (вимоги до кожного поля)
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
}) // у addSchema є метод validate, в який передається тіло запиту (req.body) - перевірка щоб в post/put-запит не пішов неповний об'єкт



// --------------------------Запит на усі контакти----------------------------------------------
router.get('/', async (req, res, next) => {  
  try{
    const result = await contactsService.listContacts(); // отримую усі контакти
    res.json(result); // відправляю масив об'єктів на фронтенд    // статус 200 повертається автоматично
  } catch(error) {
    next(error); // express піде далі шукати обробника помилок (ф-цію з 4-ма параметрами: err, req, res, next) 
    // і знайде в app.js => в мідлварі для статуса 500
  }
})


// -----------------------Запит на 1 контакт по id----------------------------------------------
router.get('/:contactId', async (req, res, next) => {
  try{
    const { contactId } = req.params; // в об'єкті params зберігаються усі динамічні частини маршруту {contactId: 'u9k...'}
    const result = await contactsService.getContactById(contactId); // отримали контакт або null   (return result || null;)
    // якщо такого id немає (повернулось null), потрібно кинути об'єкт помилки і автоматично потрапити в catch
    // інакше користувач просто побачить 'null'.
    if(!result) { 
      throw HttpError(404, `Contact with id=${contactId} not found`); // див. папку helpers. Щоб в маршрутах не дублювати код
    } 

    res.json(result); // відправили обєкт з 1м контактом   // статус 200 повертається автоматично
  } catch(error){
    next(error); // Error: Contact with id=qdggE76Jtbfd9eWJHrss not found 
    // express піде далі шукати обробника помилок і знайде в app.js => в мідлварі для статуса 500
  }
})


// -----------------------post-запит (додавання нового контакту)----------------------------------------------
router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body); 
    //здійснюється перевірка полів об'єкту на відповідність addSchema - повертається об'єкт з результатами перевірки
    // одним з ключів цього об'єкту є error, значенням якого буде undefind, якщо валідація успішна
    if(error) { // якщо валідація повернула помилку, то це буде об'єкт помилки з властивістю message (вказано у чому саме проблема)
      throw HttpError(400, error.message); // наприклад, '"phone" is required'     //"missing required name field"
    } 

    const result = await contactsService.addContact(req.body);
    res.status(201).json(result); // успішно додали контакт на сервер
  } catch(error) {
    next(error);
  }
})


// -----------------------delete-запит (видалення контакту за id)----------------------------------------------
router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params; //{ contactId: 'rsKkOQUi80UsgVPCcL' }
    const result = await contactsService.removeContact(contactId);  // отримали контакт або null   (return result || null;)

    if(!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }

    res.json({ message: `contact with id=${contactId} deleted` }); // статус 200 повертається автоматично
  } catch(error) {
    next(error);
  }
})


// -----------------------put-запит (коригування контакту за id)----------------------------------------------

router.put('/:contactId', async (req, res, next) => { 
  try {
    const { error } = addSchema.validate(req.body); //error: undefind, якщо валідація успішна

    if(error) {
      throw HttpError(400, error.message);  // наприклад, якщо передати не повний об'єкт - "\"phone\" is required"
    }

    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body); //в тіло передаємо всі поля, навіть, якщо змінили значення тільки одного

    if(!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }

    res.json(result);  // статус 200 повертається автоматично
  } catch(error) {
    next(error);
  }
})


export default router;