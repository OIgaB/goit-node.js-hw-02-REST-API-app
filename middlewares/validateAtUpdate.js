// Запускаємо валідацію при оновленні методом findByIdAndUpdate (put/putch-запити) 
//за замовчуванням runValidators (створений для оновлення): false

const validateAtUpdate = function(next) { // стрілочна ф-ція не підійде, бо втратимо this
    this.options.runValidators = true; 
    next(); // іди далі
}

// const opts = { runValidators: true };
export default validateAtUpdate;