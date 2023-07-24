// import Joi from 'joi';  // бібліотека, що перевіряє тіло запиту

// // Створюємо Joi-схему для post/put-запитів (вимоги до кожного поля)
// const addSchema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email({ minDomainSegments: 2}).trim().required(),   //minDomainSegments: 2 => example@io 
//     //або:   .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'gov', 'org', 'co'] } })   // tlds - top-level domain
//     phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).message('Phone number must be in the format (123) 456-7890').required(),  //(186) 568-3720  
//     //'\d' - to match any digit, {3} - digit should appear exactly 3 times
// }); 

//   // у addSchema є метод validate, в який передається тіло запиту (req.body) - перевірка щоб в post/put-запит не пішов неповний об'єкт

//   export default addSchema; 