// Функції-обробники запитів

import contactsService from "../models/contacts.js";
import { ctrlWrapper } from '../decorators/index.js'
import { HttpError } from '../helpers/index.js';


// --------------------------Запит на усі контакти----------------------------------------------
const listContacts = async (req, res) => { 
    const result = await contactsService.listContacts(); // отримую усі контакти
    res.json(result); // відправляю масив об'єктів на фронтенд    // статус 200 повертається автоматично
}


// -----------------------Запит на 1 контакт по id----------------------------------------------
const getContactById = async (req, res) => {
    const { contactId } = req.params; // в об'єкті params зберігаються усі динамічні частини маршруту {contactId: 'u9k...'}
      const result = await contactsService.getContactById(contactId); // отримали контакт або null   (return result || null;)
      // якщо такого id немає (повернулось null), потрібно кинути об'єкт помилки і автоматично потрапити в catch
      // інакше користувач просто побачить 'null'.
      if(!result) { 
        throw HttpError(404, `Contact with id=${contactId} not found`); // див. папку helpers. Щоб в маршрутах не дублювати код
      } 
  
      res.json(result); // відправили обєкт з 1м контактом   // статус 200 повертається автоматично
}


// -----------------------post-запит (додавання нового контакту)----------------------------------------------
const addContact = async (req, res) => {
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result); // успішно додали контакт на сервер
}


// -----------------------delete-запит (видалення контакту за id)----------------------------------------------
const removeContact = async (req, res) => {
    const { contactId } = req.params; //{ contactId: 'rsKkOQUi80UsgVPCcL' }
    const result = await contactsService.removeContact(contactId);  // отримали контакт або null   (return result || null;)
    console.log(contactId);
    if(!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    
    res.json({ message: `contact with id=${contactId} deleted` }); // статус 200 повертається автоматично
}


// -----------------------put-запит (коригування контакту за id)----------------------------------------------
const updateContact = async (req, res) => {
      const { contactId } = req.params;

      const result = await contactsService.updateContact(contactId, req.body); //в тіло передаємо всі поля, навіть, якщо змінили значення тільки одного
  
      if(!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
      }
  
      res.json(result);  // статус 200 повертається автоматично
}

export default { // під час експорту кожну ф-цію загортаємо в декоратор, а саме в try/catch
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
}
