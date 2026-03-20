import { Router } from "express";
import { ChangePasswordData } from "../controllers/user.controller";

const router = Router();

router.post("/changePassword", ChangePasswordData)
export default router;
