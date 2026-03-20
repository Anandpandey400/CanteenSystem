import { Request, Response } from "express";
import { addInventory, getConsumptionReport, getInventory, getInvLogs, GetSpecificData, stockInData, wastage } from "../services/inventory.service";


export async function getItemData(
  req: Request,
  res: Response
): Promise<void> {

  const {category} = req.body
  try {
    const Inventorys = await GetSpecificData(category);
    res.status(200).json({ message: "Inventory fetched", data: Inventorys });
  } catch (error) {
    console.error("Error fetching Inventorys:", error);
    res.status(500).json({ message: "Failed to fetch Inventorys" });
  }
}
export async function getInventoryLogs(
  req: Request,
  res: Response
): Promise<void> {

  const {inventoryId} = req.body
  try {
    const Inventorys = await getInvLogs(inventoryId);
    res.status(200).json({ message: "Inventory Logs fetched", data: Inventorys });
  } catch (error) {
    console.error("Error fetching Inventorys:", error);
    res.status(500).json({ message: "Failed to fetch Inventory logs" });
  }
}



export async function getAllInventoryData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const Inventorys = await getInventory();
    res.status(200).json({ message: "Inventory fetched", data: Inventorys });
  } catch (error) {
    console.error("Error fetching Inventorys:", error);
    res.status(500).json({ message: "Failed to fetch Inventorys" });
  }
}


export async function createInventory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {itemId,unitId,reorderLvl,amount,vendorId , price } = req.body;
    // validate input
    if (!itemId || !unitId || !reorderLvl || !amount || !vendorId || !price) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    console.log("gg", req.body)
    const result = await addInventory(req.body);
    
    res.status(201).json({ message: "Inventory created successfully", result });


  }
  catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to Create Inventory" });
  }
}

export async function StockIn(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {inventoryId,itemId,changeQty  } = req.body;
    // validate input
    if (!itemId || !itemId || !changeQty ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await stockInData(inventoryId, itemId,changeQty);
    
    res.status(201).json({ message: "Stockin successfully", result });


  }
  catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to Stockin Inventory" });
  }
}


export async function InventoryWastage (req : Request, res :Response) :Promise<void>{
   try{
 const {inventoryId,itemId,changeQty, reason  } = req.body;

    if (!itemId || !itemId || !changeQty || !reason ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await wastage(inventoryId, itemId,changeQty, reason);
    
    res.status(201).json({ message: "Wasted Removed successfully", result });


  }
  catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to remove Wasted Inventory" });
  }
}


export async function getConsumptionData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const Inventorys = await getConsumptionReport();
    res.status(200).json({ message: "Consumption Report fetched", data: Inventorys });
  } catch (error) {
    console.error("Error fetching Consumption Report:", error);
    res.status(500).json({ message: "Failed to fetch Consumption Report" });
  }
}

