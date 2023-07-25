// // Функції-обробники запитів

// import contactsService from "../models/contacts.js";
// import { ctrlWrapper } from '../decorators/index.js'
// import { HttpError } from '../helpers/index.js';


// // --------------------------Запит на усі контакти----------------------------------------------
// const listContacts = async (req, res) => { 
//     const result = await contactsService.listContacts(); // отримую усі контакти
//     res.json(result); // відправляю масив об'єктів на фронтенд    // статус 200 повертається автоматично
// }


// // -----------------------Запит на 1 контакт по id----------------------------------------------
// const getContactById = async (req, res) => {
//     const { contactId } = req.params; // в об'єкті params зберігаються усі динамічні частини маршруту {contactId: 'u9k...'}
//       const result = await contactsService.getContactById(contactId); // отримали контакт або null   (return result || null;)
//       // якщо такого id немає (повернулось null), потрібно кинути об'єкт помилки і автоматично потрапити в catch
//       // інакше користувач просто побачить 'null'.
//       if(!result) { 
//         throw HttpError(404, `Contact with id=${contactId} not found`); // див. папку helpers. Щоб в маршрутах не дублювати код
//       } 
  
//       res.json(result); // відправили обєкт з 1м контактом   // статус 200 повертається автоматично
// }


// // -----------------------post-запит (додавання нового контакту)----------------------------------------------
// const addContact = async (req, res) => {
//       const result = await contactsService.addContact(req.body);
//       res.status(201).json(result); // успішно додали контакт на сервер
// }


// // -----------------------delete-запит (видалення контакту за id)----------------------------------------------
// const removeContact = async (req, res) => {
//     const { contactId } = req.params; //{ contactId: 'rsKkOQUi80UsgVPCcL' }
//     const result = await contactsService.removeContact(contactId);  // отримали контакт або null   (return result || null;)
//     console.log(contactId);
//     if(!result) {
//         throw HttpError(404, `Contact with id=${contactId} not found`);
//     }
    
//     res.json({ message: `contact with id=${contactId} deleted` }); // статус 200 повертається автоматично
// }


// // -----------------------put-запит (коригування контакту за id)----------------------------------------------
// const updateContact = async (req, res) => {
//       const { contactId } = req.params;

//       const result = await contactsService.updateContact(contactId, req.body); //в тіло передаємо всі поля, навіть, якщо змінили значення тільки одного
  
//       if(!result) {
//         throw HttpError(404, `Contact with id=${contactId} not found`);
//       }
  
//       res.json(result);  // статус 200 повертається автоматично
// }

// export default { // під час експорту кожну ф-цію загортаємо в декоратор, а саме в try/catch
//     listContacts: ctrlWrapper(listContacts),
//     getContactById: ctrlWrapper(getContactById),
//     addContact: ctrlWrapper(addContact),
//     removeContact: ctrlWrapper(removeContact),
//     updateContact: ctrlWrapper(updateContact),
// }

import { Contact } from '../models/contacts.js'; // імпорт моделі
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';


// --------------------------Запит на усі контакти----------------------------------------------
const getAll = async (req, res) => {
  const result = await Contact.find({}, '-createdAt -updatedAt'); // поверни всі поля, крім тих, що в дужках
  res.json(result); // відправляю масив об'єктів на фронтенд     // статус 200 повертається автоматично
}


// -----------------------Запит на 1 контакт по id----------------------------------------------
const getById = async (req, res) => {
  const { contactId } = req.params; // в об'єкті params зберігаються усі динамічні частини маршруту {contactId: 'u9k...'}
  const result = await Contact.findById(contactId); // або Contact.findOne({_id: id}) - знаходить 1ше співпадіння (_id = id) або null
  // якщо такого id немає (повернулось null), потрібно кинути об'єкт помилки і автоматично потрапити в catch, інакше користувач просто побачить 'null'.
  if(!result) { 
      throw HttpError(404, `Contact with id=${contactId} not found`); // див. папку helpers. Щоб в маршрутах не дублювати код
  } 
  res.json(result); // відправили обєкт з 1м контактом   // статус 200 повертається автоматично
}


// -----------------------post-запит (додавання нового контакту)----------------------------------------------
const add = async (req, res) => {
  const result = await Contact.create(req.body); 
  res.status(201).json(result); // успішно додали контакт на сервер
}


// -----------------------put-запит (коригування контакту за id)----------------------------------------------
const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true }); //в тіло передаємо всі поля, навіть, якщо змінили значення тільки одного
  //метод findByIdAndUpdate повертає стару версію документа, хоч БД і оновлює; щоб поверталася нова версія - 3м аргументом { new: true }
      
  //mongoose за замовчуванням не проводить валідацію для findByIdAndUpdate, щоб проводив - 3й аргумент { runValidators: true }
  //const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true, runValidators: true }); 
  //щоб не забути це прописати тут, виносимо цю валідацію в схему з методом .pre

  //Якщо передати в id щось, що не є id (наприклад, не 21 символ, а 20), то null не повернеться і if не спрацює,
  //а mongoose викине помилку (щоб цього уникнути і викинути 400 помилку в папці middlewares є ф-ція isValidId)
  if(!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);  // статус 200 повертається автоматично
}


// -----------------------putch-запит (коригування контакту за id)----------------------------------------------
const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true }); //в тіло передаємо всі поля, навіть, якщо змінили значення тільки одного
  if(!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);  // статус 200 повертається автоматично
}


// -----------------------delete-запит (видалення контакту за id)----------------------------------------------
const deleteById = async (req, res) => {
    const { contactId } = req.params; //{ contactId: 'rsKkOQUi80UsgVPCcL' }
    const result = await Contact.findByIdAndRemove(contactId);  // або Contact.deleteById
    // отримали контакт або null   (return result || null;)
    if(!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json({ message: `contact with id=${contactId} successfuly deleted` }); // статус 200 повертається автоматично
}

export default { // під час експорту кожну ф-цію загортаємо в декоратор, а саме в try/catch
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(deleteById),
}
//Якщо об'єкт не проходить валідацію по mongoose-схемі, то виникає помилка. 
// Її ловить ctrlWrapper і через next(error) передає в обробник помилок в app.js (middleware з 4ма параметрами). 
// Оскільки методи mongoose видають помилки без статусу, обробник помилок присвоює їм за замовчуванням статус 500.
// Але помилка валідації тіла повинна мати статус 400. Тому окремо створили ф-цію handleMongooseError (в папці middlewares)
