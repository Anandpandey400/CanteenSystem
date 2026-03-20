import { executeStoredProcedure } from "../config/dbconfig";

interface inventoryData {
    itemId: Number,
    unitId: Number,
    reorderLvl: Number,
    amount: Number,
    vendorId: Number,
    price : Number
}


export const GetSpecificData = async (category : number) => {
    try {
        const inventory = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "flag", value: "GetSpecificData" },
            { name: "category", value: category }
        ]);
        return inventory;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
};
export const getInventory = async () => {
    try {
        const inventory = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "flag", value: "GetAllInventory" }
        ]);
        return inventory;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
};

export const addInventory = async (inventoryData: inventoryData) => {
    try {
        const { itemId,unitId,reorderLvl,amount,vendorId, price} = inventoryData;
       
        const result = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "itemId", value: itemId },
            { name: "unitId", value: unitId },
            { name: "reorderLvl", value: reorderLvl },
            { name: "amount", value: amount },
            { name: "vendorId", value: vendorId },
            { name: "price", value: price },
            { name: "flag", value: "CreateInventory" }
        ]);
        return result;

    }
    catch (error) {
        console.error("Error creating vendor master:", error);
        throw error;
    }
}


export const stockInData = async (inventoryId: number, itemId: number, changeQty: number) =>{
     try {
       
        const result = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "itemId", value: itemId },
            { name: "inventoryId", value: inventoryId },
            { name: "changeQty", value: changeQty },
            { name: "flag", value: "StockIn" }
        ]);
        return result;

    }
    catch (error) {
        console.error("Error creating vendor master:", error);
        throw error;
    }

}

export const getInvLogs = async (inventoryId: number) => {
    try {
        const inventory = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "flag", value: "logs" },
            { name: "inventoryId", value: inventoryId }
        ]);
        return inventory;
    } catch (error) {
        console.error("Error fetching log:", error);
        throw error;
    }
};

export const wastage = async (inventoryId: number, itemId: number, changeQty: number, reason : string) =>{
    try{
          const result = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "itemId", value: itemId },
            { name: "inventoryId", value: inventoryId },
            { name: "changeQty", value: changeQty },
            { name: "reason", value: reason },
            { name: "flag", value: "Wastage" }
        ]);
        return result;
           
        } catch (error) {
            console.error("Error Putting to wastage" ,error);
        }
    };


    export const getConsumptionReport = async () => {
    try {
        const inventory = await executeStoredProcedure("Stp_InventoryMaster", [
            { name: "flag", value: "Consumption" }
        ]);
        console.log("Consumption Report:", inventory);
        return inventory;
    } catch (error) {
        console.error("Error fetching Consumption Report:", error);
        throw error;
    }
};


            

