import { executeStoredProcedure } from "../config/dbconfig";

interface menuItemDetails {
    menuName: string;
    category: number;
    price: number;
    ingredients: any; 
}



export const getMenuData = async () => {
    try {
        const menu = await executeStoredProcedure("Stp_Menu", [
            { name: "flag", value: "getMenu" }
        ]);

        // Map through the results to fix the ingredients string
        const formattedMenu = menu.map(item => {
            return {
                ...item,
                // Check if ingredients exists and is a string, then parse it
                ingredients: item.ingredients && typeof item.ingredients === 'string' 
                    ? JSON.parse(item.ingredients) 
                    : item.ingredients
            };
        });

        
        return formattedMenu;
    } catch (error) {
        console.error("Error fetching menu data:", error);
        throw error;
    }
};

export const createMenuItem = async (menuItemDetails: menuItemDetails, imageUrl: string | null) => {
  try {
  
    const { menuName, category, price, ingredients } = menuItemDetails;

    const ingredientsString = JSON.stringify(ingredients); 
    console.log("Ingredients String:", ingredientsString);
    
    const result = await executeStoredProcedure("Stp_Menu", [
        { name: "menuName", value: menuName },
        { name: "category", value: category },
        { name: "price", value: price },
        { name: "ingredientJson", value: ingredientsString },
        { name: "imageUrl", value: imageUrl },
        { name: "flag", value: "createMenu" }
    ]);
    
    return result;
}
catch(error){
    console.error("Error creating menu item:", error);
    throw error;
}
}

export const deleteMenuById = async (menuId: number) => {
    try {
        const result = await executeStoredProcedure("Stp_Menu", [
            { name: "menuId", value: menuId },
            { name: "flag", value: "deleteMenu" }
        ]);
        console.log("Delete Result:", result);
        return result;
    } catch (error) {
        console.error("Error deleting menu item:", error);
        throw error;
    }
};
