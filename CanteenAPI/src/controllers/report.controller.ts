import { Request, Response } from "express";
import { getOrderReport, getSpecificOrders } from "../services/report.service";


export async function getOrderReportData(
  req: Request,
  res: Response
): Promise<void> {

  try {
    const ordersReport = await getOrderReport();
    res.status(200).json({ message: "Orders report fetched", data: ordersReport });

  }
  catch (error) {
    console.error("Error fetching orders report:", error);
    res.status(500).json({ message: "Failed to fetch orders report" });
  }
}

export async function specificOrderData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { empId } = req.body;
    const orders = await getSpecificOrders(empId);
    res.status(200).json({ message: "Orders fetched successfully", data: orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}