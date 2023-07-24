const handleMongooseError = (error, data, next) => {
    error.status = 400;   //'Bad Request'
    next();
}

export default handleMongooseError;