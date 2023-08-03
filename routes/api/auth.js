import express from 'express';
import { authCtrl } from '../../controllers/index.js'; 
import { validateBody } from '../../decorators/index.js';
import { schemas } from '../../models/user.js';
import { authenticate, upload } from '../../middlewares/index.js';

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), authCtrl.register); //signup
router.post('/login', validateBody(schemas.loginSchema), authCtrl.login); //signin

router.get('/current', authenticate, authCtrl.getCurrent);
router.patch('/subscription', authenticate, validateBody(schemas.subscriptionSchema), authCtrl.updateSubscription);
router.post('/logout', authenticate, authCtrl.logout); 
router.patch('/avatars', authenticate, upload.single('avatar'), authCtrl.updateAvatar);

export default router; // імпорт в app.js