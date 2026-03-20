import { Request, Response } from "express";
import { createMenuItem, deleteMenuById, getMenuData } from "../services/menu.service";

export async function getMenu(
  req: Request,
  res: Response
): Promise<void> {

    try{
        const menu = await getMenuData();
        res.status(200).json({ message: "Menu fetched", data: menu });

    }
    catch(error){
        console.error("Error fetching menu:", error);
        res.status(500).json({ message: "Failed to fetch menu data" }); 
    }
}

export async function createMenu(
  req: Request,
  res: Response
): Promise<void> {
  try {
    //("BODY:", req.body);
//("FILE:", req.file);
    const menuItemDetails = {
  ...req.body,
  ingredients: JSON.parse(req.body.ingredients), // ✅ FIX
};
    //("Menu Item Details:", menuItemDetails);

    let imageUrl: string | null = null;

    // 👇 multer puts file here
    if (req.file) {
      imageUrl = `/uploads/menu/${req.file.filename}`;
    }
//("Image URL:", imageUrl);
    const result = await createMenuItem(menuItemDetails, imageUrl);

    res.status(200).json({
      success: true,
      message: "Menu item created",
      data: result,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create menu item",
    });
  }
}

export async function deleteMenu(
    req: Request,
    res: Response
    ): Promise<void> {
        try{
            const {menuId} = req.body
            const result = await deleteMenuById(menuId);
            const res1 = result[0].Result;
            if(res1 === 1){
              res.status(200).json({ message: "Menu item deleted", data: result }); 
            }
        }
        catch(error){
            console.error("Error deleting menu item:", error);
            res.status(500).json({ message: "Failed to delete menu item" });
        }
    }


