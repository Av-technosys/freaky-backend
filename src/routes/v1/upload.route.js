import { Router } from 'express';
import { uploadUrl } from '../../controllers/Upload.controllers.js';

import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

// router.post("/get_S3_url", confirmUserToken, uploadUrl);
router.post('/get_S3_url', uploadUrl);

export default router;
