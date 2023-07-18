import Joi from 'joi';  // бібліотека, що перевіряє тіло запиту

// Створюємо Joi-схему для post/put-запитів (вимоги до кожного поля)
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  }) 
  // у addSchema є метод validate, в який передається тіло запиту (req.body) - перевірка щоб в post/put-запит не пішов неповний об'єкт

  export default addSchema;