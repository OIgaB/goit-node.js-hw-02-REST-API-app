import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError, validateAtUpdate } from '../middlewares';

const emailRegExp = [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'];
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
    email: {
      type: String,
      match: emailRegExp,
      required: [true, 'Email is required'],
      unique: true,   // щоб в БД не було 2 однакових email
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
    // token: String
    token: {        // під час логіну користувача будемо записувати токен в БД
      type: String,
      default: ""
    } 
}, { versionKey: false, timestamps: true });

userSchema.pre('findOneAndUpdate', validateAtUpdate);
userSchema.post('save', handleMongooseError);
userSchema.post('findOneAndUpdate', handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegExp).required(),
    password: Joi.string().min(6).required(),
    // subscription: Joi.string().valid(...subscriptionList).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegExp).required(),
    password: Joi.string().min(6).message('Enter at least 6 symbols').required(),
});

export const schemas = {
    registerSchema,
    loginSchema,
};

export const User = model('user', userSchema); // створення нової колекції (contacts, users)