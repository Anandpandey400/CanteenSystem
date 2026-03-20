import { Request, Response } from "express";
import { getAllOrders, getOrders, PlaceOrder, updateOrderStatus } from "../services/order.service";
import { getIO } from "../socket";



export async function getOrderData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const orders = await getAllOrders();
    res.status(200).json({ message: "Orders fetched successfully", data: orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}
export async function getSepcificOrderData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { empId } = req.body;
    const orders = await getOrders(empId);
    res.status(200).json({ message: "Orders fetched successfully", data: orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function placeOrderData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      cart,
      orderRefId,
      empId,
      orderAmnt,
      walletId,
      capDeduction,
      walletDeduction,
    } = req.body;

    const orderInfo = {
      orderRefId,
      empId,
      orderAmnt,
      walletId,
      capDeduction,
      walletDeduction,
    };

    const result = await PlaceOrder(cart, orderInfo);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }
     const io = getIO();

    io.emit("new-order", {
      OrderId: orderRefId, // adjust based on your response
      empId,
      orderAmnt,
      items: cart,
    });
    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error placing order:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


export async function updateOrderStatusData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { orderId, statusId } = req.body;
    const result = await updateOrderStatus(orderId, statusId);
    res.status(200).json({ message: "Order status updated successfully", data: result });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
}
