import { Router } from "express";

import auth from "./auth.route.js";
import user from "./user.route.js";
import vendor from "./vendor.route.js"
import upload from "./upload.route.js"

const router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use('/vendor', vendor)
router.use('/upload', upload)

export default router;
