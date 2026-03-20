import { Router } from "express";
import { getOrderData, getSepcificOrderData, placeOrderData, updateOrderStatusData } from "../controllers/order.controller";


const router = Router();

router.get("/getOrders",getOrderData);
router.post("/placeOrder",placeOrderData);
router.post("/updateOrderStatus",updateOrderStatusData);
router.post("/getSpecificOrder",getSepcificOrderData);



export default router;
