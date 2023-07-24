import express from 'express';

import { contactsController } from '../../controllers/index.js'; // імпорт ф-цій-контролерів (огорнуті в декоратор try/catch)  
import { addSchema } from '../../schemas/index.js';
import { validateBody } from '../../decorators/index.js'
import { isEmptyBody } from '../../middlewares/index.js';

const router = express.Router(); // об'єкт, який описує окремі маршрути (створює 1 аркуш записної книжки)


router.get('/', contactsController.listContacts);

router.get('/:contactId', contactsController.getContactById);

router.post('/', isEmptyBody, validateBody(addSchema), contactsController.addContact);
// якщо буде помилка, то через next одразу потрапимо в app.js; якщо без помилки, то буде виклик controllers.addContact

router.delete('/:contactId', contactsController.removeContact);

router.put('/:contactId', isEmptyBody, validateBody(addSchema), contactsController.updateContact);


export default router;