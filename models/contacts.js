import { Schema, model } from 'mongoose';
import Joi from 'joi';  // бібліотека, що перевіряє тіло запиту
import { validateAtUpdate } from '../middlewares/validateAtUpdate.js';
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const emailRegExp = [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'];
const phoneRegExp = [/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in the format (123) 456-7890'];

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
    match: emailRegExp,
    required: true,
  },
  phone: {
    type: String,
    match: phoneRegExp,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: { // той, хто надсилає запити
    type: Schema.Types.ObjectId,  //тут зберігається id, який генерується mongoDB (особливий тип даних)
    ref: 'user', //назва колекції, з якої цей id
    required: true,
  }
}, { versionKey: false, timestamps: true }); // об'єкт налаштувань
//versionKey - версійність документа, що створюється автоматично: _v:0
//timestamps - дата і час створення і оновлення об'єкта

contactSchema.pre('findOneAndUpdate', validateAtUpdate); // перед тим як знайти і оновити виконай ф-цію validateAtUpdate (запуск валідації при оновленні)
contactSchema.post('save', handleMongooseError); // після того як збережеш виконай ф-цію handleMongooseError (якщо буде помилка, то їй присвоїться статус 400)
contactSchema.post('findOneAndUpdate', handleMongooseError); // після того як знайдеш і оновиш виконай ф-цію handleMongooseError (якщо буде помилка, то їй присвоїться статус 400)
// всередині метод finfById лежить метод findOneAndUpdate


// Joi-схема для post/put-запитів (вимоги до кожного поля)
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2}).message('Invalid email address').trim().required(),   //minDomainSegments: 2 => example@io 
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

export const schemas = {
  addSchema,
  updateFavoriteSchema,
}

// створення моделі (це клас, що буде працювати з колекцією)
export const Contact = model('contact', contactSchema); //contact - назва колекції в однині