import { Router } from 'express';
import { adminResetPassword } from '../../controllers/admin.controllers.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);

export default router;
