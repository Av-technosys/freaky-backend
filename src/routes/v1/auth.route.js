import { Router } from "express";
import {
  confirmController,
  confirmForgotPassword,
  forgotPassword,
  signin,
  signup,
} from "../../controllers/Auth.controllers.js";

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json({ name: "ashish" });
});

router.post("/signup", signup);
router.post("/confirm", confirmController);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-forgot-password", confirmForgotPassword);

export default router;
