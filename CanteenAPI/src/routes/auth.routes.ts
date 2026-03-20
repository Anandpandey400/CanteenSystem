import { Router } from "express";
import { forgetPass, loginUser, OTPVerify, updatePasswordData } from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginUser);
router.post("/forgetPass", forgetPass);
router.post("/OTPVerify", OTPVerify);
router.post("/updatePassword", updatePasswordData);

export default router;
