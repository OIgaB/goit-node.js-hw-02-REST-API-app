import { Contact } from '../models/contacts.js'; // імпорт моделі
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';



// --------------------------Запит на усі контакти----------------------------------------------
const getAll = async (req, res) => {
  const {_id: owner } = req.user; // дізнаємося, хто робить запит (деструктуризація з перейменуванням)

  const { page = 1, limit = 20 } = req.query; // page - сторінка, яку хочу отримати; limit - к-ть контактів (об'єктів) на сторінці
  // 1 та 10 - це значення за замовчуванням

  const skip = (page - 1) * limit;

  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate('owner', 'email subscription'); 
  // 1й аргумент - знайди лише ті книги, які додала конкретна людина - owner;
  // 2й - поверни всі поля, крім createdAt і updatedAt
  // 3й - додаткові налаштування - тут - параметрів запиту (пагінація). Mongoose має вбудований інструмент для пагінації:
  // skip - скільни пропустити об'єктів у БД з початку; limit - скільки повернути
  // populate - інструмент для розширення запиту - в тому, що ти знайшов, розшир інфо про 'owner' (обмежся тільки email і subscription). Тепер буде не 'owner': 'sfcsd8se3', а 'owner': {...}

  res.json(result); // відправляю масив об'єктів на фронтенд     // статус 200 повертається автоматично
}


// -----------------------Запит на 1 контакт по id----------------------------------------------
const getById = async (req, res) => {
  const { id } = req.params; // в об'єкті params зберігаються усі динамічні частини маршруту {id: 'u9k...'}
  const result = await Contact.findById(id); // або Contact.findOne({_id: id}) - знаходить 1ше співпадіння (_id = id) або null
  // якщо такого id немає (повернулось null), потрібно кинути об'єкт помилки і автоматично потрапити в catch, інакше користувач просто побачить 'null'.
  if(!result) { 
      throw HttpError(404, `Contact with id=${id} not found`); // див. папку helpers. Щоб в маршрутах не дублювати код
  } 
  res.json(result); // відправили обєкт з 1м контактом   // статус 200 повертається автоматично
}


// -----------------------post-запит (додавання нового контакту)----------------------------------------------
const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create(...req.body, owner); // тепер кожний контакт буде належати конкретному його створювачу
  res.status(201).json(result); // успішно додали контакт на сервер
}


// -----------------------put-запит (коригування контакту за id)----------------------------------------------
const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true }); //в тіло передаємо всі поля, навіть, якщо змінили значення тільки одного
  //метод findByIdAndUpdate повертає стару версію документа, хоч БД і оновлює; щоб поверталася нова версія - 3м аргументом { new: true }
      
  //mongoose за замовчуванням не проводить валідацію для findByIdAndUpdate, щоб проводив - 3й аргумент { runValidators: true }
  //const result = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); 
  //щоб не забути це прописати тут, виносимо цю валідацію в схему з методом .pre

  //Якщо передати в id щось, що не є id (наприклад, не 21 символ, а 20), то null не повернеться і if не спрацює,
  //а mongoose викине помилку (щоб цього уникнути і викинути 400 помилку в папці middlewares є ф-ція isValidId)
  if(!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);  // статус 200 повертається автоматично
}


// -----------------------patch-запит (коригування контакту за id)----------------------------------------------
const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true }); 
  console.log(result); 
  if(!result) {
    throw HttpError(404, `Contact with id=${id} not found`); 
  }
  res.json(result);  // статус 200 повертається автоматично
}


// -----------------------delete-запит (видалення контакту за id)----------------------------------------------
const deleteById = async (req, res) => {
    const { id } = req.params; //{ id: 'rsKkOQUi80UsgVPCcL' }
    const result = await Contact.findByIdAndRemove(id);  // або Contact.findByIdAndDelete або Contact.deleteById 
    // отримали контакт або null   (return result || null;)
    if(!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({ message: `contact with id=${id} successfuly deleted` }); // статус 200 повертається автоматично
}

export default { // під час експорту кожну ф-цію загортаємо в декоратор, а саме в try/catch
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(deleteById),
}
//Якщо об'єкт не проходить валідацію по mongoose-схемі, то виникає помилка. 
// Її ловить ctrlWrapper і через next(error) передає в обробник помилок в app.js (middleware з 4ма параметрами). 
// Оскільки методи mongoose видають помилки без статусу, обробник помилок присвоює їм за замовчуванням статус 500.
// Але помилка валідації тіла повинна мати статус 400. Тому окремо створили ф-цію handleMongooseError (в папці middlewares)
