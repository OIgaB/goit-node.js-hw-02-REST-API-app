// import fs from "fs/promises"; // пакет, що відповідає за роботу з файлами і папками
// import path from "path"; // пакет, що відповідає за роботу зі шляхами
// import { nanoid } from 'nanoid';           

// const contactsPath = path.resolve('models', 'contacts.json'); 
// //метод resolve об'єднує аргументи в 1 шлях і нормалізує його, проставляючи "/", 
// //а також на початок додає абсолютний шлях до кореня проєкту, тобто з диска С до папки з проєктом 

// //Загальна службова ф-ція (для видалення, додавання і оновлення)
// const updateContactsStorage = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));


// // Повертає масив контактів
// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath);  // data - це буфер
//   return JSON.parse(data); // самостійне розкодування буферу (без utf-8); повертає масив об'єктів 
// }


// // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений
// const getContactById = async (contactId) => {
//   const contacts = await listContacts(); //отримуємо масив контактів
//   const result = contacts.find(item => item.id === contactId); // знаходимо потрібний об'єкт контакту 
//   return result || null;
// }


// // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
// const removeContact = async (contactId) => {
//   const contacts = await listContacts(); //отримуємо масив контактів
//   const index = contacts.findIndex(item => item.id === contactId); // знаходимо індекс контакту, який хочемо видалити
//   if(index === -1) { // якщо не знаходить id
//       return null;
//   }
//   const [result] = contacts.splice(index, 1); //повертає видалений елемент
//   await updateContactsStorage(contacts); //перезапис json
//   return result; // повертаємо об'єкт видаленого контакту
// }

// // Повертає об'єкт доданого контакту
// const addContact = async ({ name, email, phone }) => {   
//   const contacts = await listContacts(); //отримуємо масив контактів
//   const newContact = {
//       id: nanoid(),
//       name,
//       email,
//       phone,
//   }
//   contacts.push(newContact); // додаємо новий фільм у масив
//   await updateContactsStorage(contacts); //перезапис json
//   return newContact; // повертаємо об'єкт доданого контакту
// }

// // Повертає об'єкт оновленого контакту
// const updateContact = async (id, body) => {  // або (contactId, {name, email, phone}) 
//   // передали contactId, отримали id (оскільки в contacts.json треба передавати саме ключ id) 
//   const contacts = await listContacts(); //отримуємо масив контактів
//   const index = contacts.findIndex(item => item.id === id); // знаходимо індекс контакту, який хочемо змінити
//   if(index === -1) {  // якщо не знаходить id
//       return null;
//   }
//   contacts[index] = {id, ...body}; //або {contactId, name, email, phone} - перезапис знайденого за id об'єкту контакту новим об'єктом
//   await updateContactsStorage(contacts); //перезапис json
//   return contacts[index]; // повертаємо об'єкт перезаписаного контакту
// }


// export default {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }





import { Schema, model } from 'mongoose';
import Joi from 'joi';  // бібліотека, що перевіряє тіло запиту
import { validateAtUpdate, handleMongooseError } from '../middlewares/index.js';


//mongoose-схема - вимоги до об'єкта (перевірка полів, що будуть вноситись в БД): 
//якщо на фронтенді забудуть зробити перевірку, або не пропишуть joi-схему
const contactSchema = new Schema({ 
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'],
    required: true,
  },
  phone: {
    type: String,
    match: [/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in the format (123) 456-7890'],
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, timestamps: true }); // об'єкт налаштувань
//versionKey - версійність документа, що створюється автоматично: _v:0
//timestamps - дата і час створення і оновлення об'єкта

contactSchema.pre('findOneAndUpdate', validateAtUpdate); // перед тим як знайти і оновити виконай ф-цію validateAtUpdate (запуск валідації при оновленні)
contactSchema.post('save', handleMongooseError);// після того як збережеш виконай ф-цію handleMongooseError (якщо буде помилка, то їй присвоїться статус 400)
contactSchema.post('findOneAndUpdate', handleMongooseError); // після того як знайдеш і оновиш виконай ф-цію handleMongooseError (якщо буде помилка, то їй присвоїться статус 400)
// всередині метод finfById лежить метод findOneAndUpdate


// Joi-схема для post/put-запитів (вимоги до кожного поля)
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2}).trim().required(),   //minDomainSegments: 2 => example@io 
    //або:   .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'gov', 'org', 'co'] } })   // tlds - top-level domain
    phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).message('Phone number must be in the format (123) 456-7890').required(),    
    //'\d' - any digit, {3} - digit should appear exactly 3 times
    favorite: Joi.boolean(),
}); 
  // у addSchema є метод validate, в який передається тіло запиту (req.body) - перевірка щоб в post/put-запит не пішов неповний об'єкт

// Joi-схема для putch-запитів
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
}); 

const schemas = {
  addSchema,
  updateFavoriteSchema,
}

// створення моделі (це клас, що буде працювати з колекцією)
const Contact = model('contact', contactSchema); //contact - назва колекції в однині

export default {
  Contact,
  schemas,
}