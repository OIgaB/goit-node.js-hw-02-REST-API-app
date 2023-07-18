// Отримуємо контроллер (ctrl) і створюємо ф-цію обгортку (декоратор), яка огортає контроллер в try/catch 

const ctrlWrapper = ctrl => {  //отримує, наприклад, getContactById
    const func = async(req, res, next) => { 
        try {
            await ctrl(req, res, next); // передача значень в getContactById
        } catch(error) {  // якщо в контролері станеться помилка, ф-ція-обгортка спіймає її і передасть в catch
            next(error);  // express піде далі шукати обробника помилок (ф-цію з 4-ма параметрами: err, req, res, next)
                          // і знайде в app.js => в мідлварі для статусу 500
                          // Error: Contact with id=qdggE76Jtbfd9eWJHrss not found 
        }
    }
    return func;
}

export default ctrlWrapper;