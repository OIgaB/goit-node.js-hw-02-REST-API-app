import express, { request } from 'express';
import Joi from 'joi';  // бібліотека, що перевіряє тіло запиту
import contacts from '../../models/contacts.js'; // імпорт усіх ф-цій для роботи з contacts.json
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
    const result = await contacts.listContacts(); // отримую усі контакти
    res.json(result); // відправляю масив об'єктів на фронтенд
  } catch(error) {
    next(error); // іди далі і шукай обробника помилок (ф-цію з 4-ма параметрами: err, req, res, next) - express знайде його в app.js (для статуса 500)
  }
})


// -----------------------Запит на 1 контакт по id----------------------------------------------
router.get('/:contactId', async (req, res, next) => {
  try{
    const { id } = req.params; // в об'єкті params зберігаються усі динамічні частини маршруту {id: 'u9k...'}
    const result = await contacts.getContactById(id); // отримали книгу або null   (return result || null;)
    
    // якщо такого id не буде (повернулось null), то повернеться обєкт error, і нас перекине в catch
    if(!result) { 
      throw HttpError(404, "Not found"); // див. папку helpers. Щоб в маршрутах не дублювати код
    } 

    res.json(result); // відправили обєкт з 1м контактом
  } catch(error){
    next(error);
  }
})


// -----------------------post-запит (додавання нового контакту)----------------------------------------------
router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body); //здійснюється перевірка полів об'єкту на відповідність addSchema - повертається об'єкт
    
    // одним з ключів цього об'єкту є error, значенням якого буде undefind, якщо валідація успішна
    if(error) { // якщо валідація повернула помилку, то це буде об'єкт помилки з властивістю message (вказано у чому саме проблема)
      throw HttpError(400, error.message); // наприклад, '"phone" is required'     //"missing required name field"
    } 

    const result = await contacts.addContact(req.body);
    res.status(201).json(result); // успішно додали книгу на сервер
  } catch(error) {
    next(error);
  }
})



router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})
// Не отримує body
// Отримує параметр id
// Викликає функцію removeContact для роботи з json-файлом contacts.json
// якщо такий id є, повертає json формату {"message": "contact deleted"} і статусом 200
// якщо такого id немає, повертає json з ключем "message": "Not found" і статусом 404

// // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
// async function removeContact(contactId) { 
//   const contacts = await listContacts(); //отримуємо масив контактів
//   const index = contacts.findIndex(item => item.id === contactId); // знаходимо індекс контакту, який хочемо видалити
//   if(index === -1) { // якщо не знаходить id
//       return null;
//   }
//   const [result] = contacts.splice(index, 1); //повертає видалений елемент
//   await updateContactsStorage(contacts); //перезапис json
//   return result; // повертаємо об'єкт видаленого контакту
// }

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

// Отримує параметр id
// Отримує body в json-форматі c оновленням будь-яких полів name, email и phone
// Якщо body немає, повертає json з ключем {"message": "missing fields"} і статусом 400
// Якщо з body всі добре, викликає функцію updateContact(contactId, body). (Напиши її) для поновлення контакту в файлі contacts.json
// За результатом роботи функції повертає оновлений об'єкт контакту і статусом 200. В іншому випадку, повертає json з ключем "message": "Not found" і статусом 404
// продумайте перевірку (валідацію) отриманих даних

export default router;