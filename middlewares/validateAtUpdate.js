// Запускаємо валідацію при оновленні (за замовчуванням runValidators, який створений для оновлення: false)

const validateAtUpdate = function(next) { // стрілочна ф-ція не підійде, бо втратимо this
    this.options.runValidators = true; 
    next(); // іди далі
}

// const opts = { runValidators: true };
export default validateAtUpdate;