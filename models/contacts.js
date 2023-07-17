// const fs = require('fs/promises')

// import fs from "fs/promises"; // пакет, що відповідає за роботу з файлами і папками

// import path from "path"; // пакет, що відповідає за роботу зі шляхами

// import { nanoid } from 'nanoid'; // ES-6ті модулі    якщо Common.js, то const { nanoid } = require('nanoid');            

// const contactsPath = path.resolve('db', 'contacts.json'); 
// //метод resolve об'єднує аргументи в 1 шлях і нормалізує його, проставляючи "/", 
// //а також на початок додає абсолютний шлях до кореня проєкту, тобто з диска С до папки goit-node.js-hw-01-CLI-app 

// //Загальна службова ф-ція
// const updateContactsStorage = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));




const listContacts = async () => {}

// // Повертає масив контактів
// async function listContacts() { 
//   const data = await fs.readFile(contactsPath);  // data - це буфер
//   return JSON.parse(data); // самостійне розкодування буферу (без utf-8); повертає масив об'єктів 
// }



const getContactById = async (contactId) => {}

// // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений
// async function getContactById(contactId) {
//   const contacts = await listContacts(); //отримуємо масив контактів
//   const result = contacts.find(item => item.id === contactId); // знаходимо потрібний об'єкт контакту 
//   return result || null;
// }





const removeContact = async (contactId) => {}

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






const addContact = async (body) => {}

// // Повертає об'єкт доданого контакту
// async function addContact({ name, email, phone }) { 
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





const updateContact = async (contactId, body) => {}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
