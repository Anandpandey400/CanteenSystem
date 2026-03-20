import { Router } from "express";
import { getOrderReportData, specificOrderData } from "../controllers/report.controller";


const router = Router();

router.post("/getOrderReportData", getOrderReportData);
router.post("/specificOrderData", specificOrderData);


export default router;
