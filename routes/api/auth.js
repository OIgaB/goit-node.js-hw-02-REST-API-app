import express from 'express';
import { authCtrl } from '../../controllers/index.js'; 
import { validateBody } from '../../decorators/index.js';
import { schemas } from '../../models/user.js';
import { authenticate } from '../../middlewares/index.js';

const router = express.Router();

//signup
router.post('/register', validateBody(schemas.registerSchema), authCtrl.register);
//signin
router.post('/login', validateBody(schemas.loginSchema), authCtrl.login);

router.get('/current', authenticate, authCtrl.getCurrent);
router.get('/logout', authenticate, authCtrl.logout); // будемо знати, хто хоче розлогінитись

export default router; // імпорт в app.js