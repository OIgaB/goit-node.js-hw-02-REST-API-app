//методи mongoose видають помилки без статусу, обробник помилок присвоює їм за замовчуванням статус 500.
//А помилка валідації тіла повинна мати статус 400.

const handleMongooseError = (error, data, next) => {
    error.status = 400;   //'Bad Request'
    next();
}

export default handleMongooseError;