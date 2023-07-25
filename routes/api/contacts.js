import express from 'express';

import { ctrl } from '../../controllers/index.js'; // імпорт ф-цій-контролерів (огорнуті в декоратор try/catch)  
import { validateBody } from '../../decorators/index.js'
import { schemas } from '../../models/contacts.js';
import { isEmptyBody, isValidId } from '../../middlewares/index.js';

const router = express.Router(); // об'єкт, який описує окремі маршрути (створює 1 аркуш записної книжки)


router.get('/', ctrl.getAll);

router.get('/:id', isValidId, ctrl.getById);

router.post('/', isEmptyBody, validateBody(schemas.addSchema), ctrl.add);
// якщо буде помилка, то через next одразу потрапимо в app.js

router.put('/:id', isValidId, isEmptyBody, validateBody(schemas.addSchema), ctrl.updateById);

router.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact);
//favorite - вказали поле, яке треба оновити. Передаємо іншу joi-схему

router.delete('/:id', isValidId, ctrl.deleteById);


export default router; // імпорт в app.js

//validateBody(schemas), isEmptyBody - де передається тіло (post/put/patch)
//isValidId - де для запитів потрібний id (get/put/patch/delete)