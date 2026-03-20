const express = require("express")
const app = express();
const router = express.Router()
import  userRoutes  from "./routes/user.routes"
import  authRoutes  from "./routes/auth.routes"
import  masterRoutes  from "./routes/master.routes"
import inventoryRoutes from "./routes/inventory.routes"
import menuRoutes from "./routes/menu.routes"
import walletRoutes from "./routes/wallet.routes"
import orderRoutes from "./routes/order.routes"
import reportRoutes from "./routes/report.routes"

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/master", masterRoutes);
router.use("/inventory",inventoryRoutes)
router.use("/menu", menuRoutes);
router.use("/wallet",walletRoutes);
router.use("/order",orderRoutes);
router.use("/report",reportRoutes);

export default router;