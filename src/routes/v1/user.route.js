import { Router } from "express";
import {
  addAddress,
  editAddresses,
  getUserInfo,
  listAllAddresses,
  setCurrentAddress,
  updateUserInfo,
} from "../../controllers/User.controllers.js";
import { confirmUserToken } from "../../middleware/user.middleware.js";

const router = Router();

router.get("/get_personal_info", confirmUserToken, getUserInfo);
router.get("/list_all_addresses", confirmUserToken, listAllAddresses);

router.post("/update_personal_info", confirmUserToken, updateUserInfo);
router.post("/add_address", confirmUserToken, addAddress);
router.post("/edit_address", confirmUserToken, editAddresses);
router.post("/set_current_address", confirmUserToken, setCurrentAddress);

export default router;
