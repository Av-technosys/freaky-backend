import { Router } from "express";
import {uploadUrl} from "../../controllers/Upload.controllers.js";

import { confirmUserToken } from "../../middleware/user.middleware.js";

const router = Router();

router.post("/get_S3_url", confirmUserToken, uploadUrl);


export default router;
