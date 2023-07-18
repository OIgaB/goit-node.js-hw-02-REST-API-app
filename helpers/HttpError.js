const messageList = { // статув 200 повертається автоматично, всі інші статуси треба явно прописувати
    400: 'Bad Request',
    401: 'Unathorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
}

// ф-ція названа як іменник і з великої літери, бо створюється і повертається новий об'єкт 
const HttpError = (status, message = messageList[status]) => { // якщо message не передали, то встановлюємо його значення за замовчуванням
  const error = new Error(message);
  console.log('error in HttpError:', error);
  error.status = status;
  return error;  
} 

export default HttpError;