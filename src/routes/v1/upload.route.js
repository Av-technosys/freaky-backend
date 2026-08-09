import { Router } from 'express';
import { uploadUrl, testS3 } from '../../controllers/Upload.controllers.js';

import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

// router.post("/get_S3_url", confirmUserToken, uploadUrl);
router.post('/get_S3_url', uploadUrl);
router.get('/test_s3', testS3);

export default router;
