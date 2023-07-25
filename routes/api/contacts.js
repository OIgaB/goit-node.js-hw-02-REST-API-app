import express from 'express';

import { contactsController } from '../../controllers/index.js'; // імпорт ф-цій-контролерів (огорнуті в декоратор try/catch)  
import { validateBody } from '../../decorators/index.js'
import { schemas } from '../../models/contacts.js';
import { isEmptyBody, isValidId } from '../../middlewares/index.js';

const router = express.Router(); // об'єкт, який описує окремі маршрути (створює 1 аркуш записної книжки)


router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, contactsController.getById);

router.post('/', isEmptyBody, validateBody(schemas.addSchema), contactsController.add);
// якщо буде помилка, то через next одразу потрапимо в app.js

router.put('/:contactId', isValidId, isEmptyBody, validateBody(schemas.addSchema), contactsController.updateById);

router.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(schemas.updateFavoriteSchema), contactsController.updateFavorite);
//favorite - вказали поле, яке треба оновити. Передаємо іншу joi-схему

router.delete('/:contactId', isValidId, contactsController.deleteById);


export default router;


//validateBody(schemas), isEmptyBody - де передається тіло (post/put/patch)
//isValidId - де для запитів потрібний id (get/put/patch/delete)