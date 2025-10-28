import { Router } from "express";

import auth from "./auth.route.js";

const router = Router();
console.log("inside v1");
router.use("/auth", auth);

export default router;
