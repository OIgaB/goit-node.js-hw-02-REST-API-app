import fs from "fs/promises"; // пакет, що відповідає за роботу з файлами і папками

import path from "path"; // пакет, що відповідає за роботу зі шляхами

import { nanoid } from 'nanoid';           

const contactsPath = path.resolve('models', 'contacts.json'); 
//метод resolve об'єднує аргументи в 1 шлях і нормалізує його, проставляючи "/", 
//а також на початок додає абсолютний шлях до кореня проєкту, тобто з диска С до папки з проєктом 

//Загальна службова ф-ція
const updateContactsStorage = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));


// Повертає масив контактів
const listContacts = async () => {
  const data = await fs.readFile(contactsPath);  // data - це буфер
  return JSON.parse(data); // самостійне розкодування буферу (без utf-8); повертає масив об'єктів 
}


// Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений
const getContactById = async (contactId) => {
  const contacts = await listContacts(); //отримуємо масив контактів
  const result = contacts.find(item => item.id === contactId); // знаходимо потрібний об'єкт контакту 
  return result || null;
}


// Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
const removeContact = async (contactId) => {
  const contacts = await listContacts(); //отримуємо масив контактів
  const index = contacts.findIndex(item => item.id === contactId); // знаходимо індекс контакту, який хочемо видалити
  if(index === -1) { // якщо не знаходить id
      return null;
  }
  const [result] = contacts.splice(index, 1); //повертає видалений елемент
  await updateContactsStorage(contacts); //перезапис json
  return result; // повертаємо об'єкт видаленого контакту
}

// Повертає об'єкт доданого контакту
const addContact = async ({ name, email, phone }) => {   //body
  const contacts = await listContacts(); //отримуємо масив контактів
  const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
  }
  contacts.push(newContact); // додаємо новий фільм у масив
  await updateContactsStorage(contacts); //перезапис json
  return newContact; // повертаємо об'єкт доданого контакту
}


const updateContact = async (contactId, body) => {
  const contacts = await listContacts(); //отримуємо масив контактів
  const index = contacts.findIndex(item => item.id === contactId); // знаходимо індекс контакту, який хочемо змінити
  if(index === -1) {  // якщо не знаходить id
      return null;
  }
  contacts[index] = {contactId, ...body}; // перезапис знайденого за id об'єкту контакту новим об'єктом
  await updateContactsStorage(contacts); //перезапис json
  return contacts[index]; // повертаємо об'єкт перезаписаного контакту
}


export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
