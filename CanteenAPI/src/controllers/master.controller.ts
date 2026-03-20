import { Request, Response } from "express";
import { createEmployeeMaster, createItem, createPrice, createVendorMaster, genericMasterDropdown, getCategorySpecificData, getEmployeeData, getItemData, getPriceData, getVendorData, updateEmployee } from "../services/master.service";

export async function createEmployee(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { EmployeeCode, EmployeeName, Email, CapAmount, mobile, userName, password } = req.body;
    // validate input
   // console.log("CHECKS:", req.body);
   if (
  !EmployeeCode ||
  !EmployeeName ||
  !Email ||
  CapAmount === undefined ||
  !mobile ||
  userName === undefined 
) {
  res.status(400).json({ message: "All fields are required" });
  return;
}

    const result = await createEmployeeMaster(req.body);

    res.status(201).json({ message: "Employee created successfully", result });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function getEmployees(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const employees = await getEmployeeData();
    res.status(200).json({ message: "Employee fetched", data: employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
}

export async function createVendor(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { VendorCode, VendorName, Email, Mobile } = req.body;
    // validate input
    if (!VendorCode || !VendorName || !Email || Mobile === undefined) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await createVendorMaster(req.body);
    if (result[0]?.Result === 0) {
      res.status(400).json({ message: "Vendor already exists" });
      return;
    }
    res.status(201).json({ message: "Vendor created successfully", result });


  }
  catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to Create vendor" });
  }
}

export async function updateEmployeeData( req: Request,
  res: Response) : Promise<void>{
  try {
    const { empId,  Email, CapAmount, mobile, userName } = req.body;
    // validate input
   if (

  !Email ||
  CapAmount === undefined ||
  !mobile ||
  userName === undefined
) {
  res.status(400).json({ message: "All fields are required" });
  return;
}
    const result = await updateEmployee(req.body);

    res.status(200).json({ message: "Employee Updated successfully", result });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to Upddate user" });
  }
  
}


export async function getVendors(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendor = await getVendorData();
    res.status(200).json({message : 'Vendor Data Fetched',data:vendor});
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Failed to fetch vendor" });
  }
}



export async function getAllItems(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const items = await getItemData();
    res.status(200).json({ message: "Data fetched successfully", data: items });

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
}

export async function createItemMaster(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { itemName, category } = req.body;
    if (!itemName || !category ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await createItem(req.body);
    res.status(201).json({ message: "Item created successfully", result });
  }
  catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Failed to Create item" });
  }
}

export async function getGenericMaster(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { masterTypeId } = req.body;
    // validate input
    if (!masterTypeId ) {
      res.status(400).json({ message: "MastertypeId are required" });
      return;
    }
    const result = await genericMasterDropdown(req.body);
    res.status(201).json({ message: "Dropdown data fetched successfully", result });
  }
  catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
}


export async function getAllPrice(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const items = await getPriceData();
    res.status(200).json({ message: "Data fetched successfully", data: items });

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
}

export async function createPriceMaster(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {itemId,price,periodFrom, periodTo } = req.body;
    if (!itemId || !price || !periodFrom ||!periodTo ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await createPrice(req.body);
    res.status(201).json({ message: "Price created successfully", result });
  }
  catch (error) {
    console.error("Error creating Price:", error);
    res.status(500).json({ message: "Failed to Create Price" });
  }
}

export async function getCategorySpecific(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { category } = req.body;
    const items = await getCategorySpecificData(category);
    res.status(200).json({ message: "Data fetched successfully", data: items });

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
}
