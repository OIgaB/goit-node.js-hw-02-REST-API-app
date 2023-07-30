import express from 'express';

import { contactsCtrl } from '../../controllers/index.js'; // імпорт ф-цій-контролерів (огорнуті в декоратор try/catch)  
import { validateBody } from '../../decorators/index.js'
import { schemas } from '../../models/contacts.js';
import { authenticate, isEmptyBody, isValidId } from '../../middlewares/index.js';

const router = express.Router(); // об'єкт, який описує окремі маршрути (створює 1 аркуш записної книжки)

router.use(authenticate); // мідлвара - альтернатива прописуванню authenticate в кожному роуті


router.get('/', contactsCtrl.getAll);

router.get('/:id', isValidId, contactsCtrl.getById);

router.post('/', isEmptyBody, validateBody(schemas.addSchema), contactsCtrl.add);
// якщо буде помилка, то через next одразу потрапимо в app.js

router.put('/:id', isValidId, isEmptyBody, validateBody(schemas.addSchema), contactsCtrl.updateById);

router.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(schemas.updateFavoriteSchema), contactsCtrl.updateStatusContact);
//favorite - вказали поле, яке треба оновити. Передаємо іншу joi-схему

router.delete('/:id', isValidId, contactsCtrl.deleteById);


export default router; // імпорт в app.js

//validateBody(schemas), isEmptyBody - де передається тіло (post/put/patch)
//isValidId - де для запитів потрібний id (get/put/patch/delete)