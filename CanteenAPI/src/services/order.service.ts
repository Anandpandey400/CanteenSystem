import { executeStoredProcedure } from "../config/dbconfig";

export const getAllOrders = async () => {
    try {
        const orders = await executeStoredProcedure("Stp_Order", [  
            { name: "flag", value: "getAllOrders" }
        ]);
        const formattedOrders = orders.map(order => {
    return {
        ...order,
        items: order.items && typeof order.items === 'string'
            ? JSON.parse(order.items)
            : order.items
    };
});

        return formattedOrders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};
export const getOrders = async (empId : number) => {
    try {
        const orders = await executeStoredProcedure("Stp_Order", [  
            { name: "flag", value: "getOrder" },
            { name: "empId", value: empId }
        ]);
       
        const formattedOrders = orders.map(order => {
    return {
        ...order,
        items: order.items && typeof order.items === 'string'
            ? JSON.parse(order.items)
            : order.items
    };
});

        return formattedOrders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const PlaceOrder = async (cart: any[], orderInfo: any) => {
  const {
    orderRefId,
    empId,
    orderAmnt,
    walletId,
    capDeduction,
    walletDeduction,
  } = orderInfo;

  const rows = await executeStoredProcedure("Stp_Order", [
    { name: "flag", value: "PlaceOrder" },
    { name: "orderRefId", value: orderRefId },
    { name: "empId", value: empId },
    { name: "orderAmnt", value: orderAmnt },
    { name: "walletId", value: walletId },
    { name: "capDeduction", value: capDeduction },
    { name: "walletDeduction", value: walletDeduction },
    { name: "cart", value: JSON.stringify(cart) },
  ]);

  // 🔴 No rows returned
  if (!rows || rows.length === 0) {
    return {
      success: false,
      message: "No response from database",
    };
  }

  const result = rows[0]; // ✅ FIRST ROW

  // 🔴 Business failure
  if (result.result !== "SUCCESS") {
    return {
      success: false,
      message: result.result || "Order failed",
    };
  }

  // 🟢 Success
  return {
    success: true,
    data: {
      orderId: result.orderId,
      orderRefId: result.orderRefId,
      amount: result.amount,
    },
  };
};



export const updateOrderStatus = async (orderId: number, statusId: string) => {
    try {
        const result = await executeStoredProcedure("Stp_Order", [  
            { name: "flag", value: "UpdateStatus" },
            { name: "orderId", value: orderId },
            { name: "statusId", value: statusId }
        ]);
        return result;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }}



