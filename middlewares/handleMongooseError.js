//методи mongoose видають помилки без статусу, обробник помилок присвоює їм за замовчуванням статус 500.
//А помилка валідації тіла повинна мати статус 400 (Bad Request).
//А дубль унікального поля - 409 (Conflict).

const handleMongooseError = (error, data, next) => {
    const { name, code } = error; //name, code вказують, яку помилку отримали
    //помилка дублювання унікального поля: name - MongoServerError, code - 11000
    //інша помилка: name - ValidationError, code - undefined

    const status = (name === 'MongoServerError' && code === 11000) ? 409 : 400;
    error.status = status;
    next();
}

export default handleMongooseError;