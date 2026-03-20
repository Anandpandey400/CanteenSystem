import { executeStoredProcedure } from "../config/dbconfig";

export const getOrderReport = async () => {
    try {
        const ordersReport = await executeStoredProcedure("Stp_Report", [  
            { name: "flag", value: "orderReport" }
        ]);

        return ordersReport;
    } catch (error) {
        console.error("Error fetching orders report:", error);
        throw error;
    }
};
export const getSpecificOrders = async (empId: string) => {
    try {
        const orders = await executeStoredProcedure("Stp_Report", [  
            { name: "flag", value: "SpecificReport" },
            {name: "empId", value: empId}
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