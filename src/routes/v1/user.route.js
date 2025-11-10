import { Router } from "express";
import {
  addAddress,
  getUserInfo,
  listAllAddresses,
} from "../../controllers/User.controllers.js";
import { confirmUserToken } from "../../middleware/user.middleware.js";

const router = Router();

router.get("/get_personal_info", confirmUserToken, getUserInfo);
router.post("/add_address", confirmUserToken, addAddress);
router.get("/list_all_addresses", confirmUserToken, listAllAddresses);

export default router;
