import { Router } from "express";
import { createMenu, deleteMenu, getMenu } from "../controllers/menu.controller";
import upload from "../middleware/upload.middleware";



const router = Router();

/**
 * @swagger
 * /menu/getMenu:
 *   get:
 *     summary: Get all menu
 *     tags: [Master]
 *     responses:
 *       200:
 *         description: Menu list fetched successfully
 */
router.get("/getMenu", getMenu);

router.post("/createMenu", upload.single("image"),createMenu);

router.post("/deleteMenu",deleteMenu );


export default router;
