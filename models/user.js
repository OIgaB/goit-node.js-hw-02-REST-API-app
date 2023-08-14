import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { validateAtUpdate} from '../middlewares/validateAtUpdate.js'
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailMessage = 'Sorry, the provided email address is not valid. Please ensure it follows the correct format. Examples of valid email addresses: john.doe@example.com, jane_doe123@example.co.uk, user123@example-domain.com';
const subscriptionList = ["starter", "pro", "business"];


const userSchema = new Schema({
    email: {
      type: String,
      match: emailRegExp,
      unique: true,   // щоб в БД не було 2 однакових email
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Set password for user'],
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter"
    },
    avatarURL: String,
    token: {        // під час логіну користувача будемо записувати токен в БД
      type: String,
      default: ""
    } 
}, { versionKey: false, timestamps: true });

userSchema.pre("findOneAndUpdate", validateAtUpdate);
userSchema.post('save', handleMongooseError);
userSchema.post('findOneAndUpdate', handleMongooseError);

// Joi-схеми для post/put-запитів (вимоги до кожного поля)
const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegExp).message(emailMessage).required(),
    password: Joi.string().min(6).message('Ensure your password contains at least 6 symbols').required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegExp).message(emailMessage).required(),
    password: Joi.string().min(6).message('Ensure your password contains at least 6 symbols').required(),
});

// Joi-схема для putch-запитів
const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptionList).required(),
});

export const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
};

export const User = model('user', userSchema); // створення нової колекції (contacts, users)