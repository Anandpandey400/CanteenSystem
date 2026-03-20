import { executeStoredProcedure } from "../config/dbconfig";
import { hashPassword } from "../config/password";

interface employeDetails {
    EmployeeCode: string;
    EmployeeName: string;
    Email: string;
    CapAmount: number;
    mobile : number;
    userName : string;
    empId : number;
    password: string
}
interface vendorDetails {
    VendorCode: string;
    VendorName: string;
    Email: string;
    Mobile: number;
}
interface masterType{
    masterTypeId:number
}
interface itemsDetails{
    itemName:string,
    category:number
}
interface priceDetails {
        itemId : number ,price : number ,
        periodFrom : Date, 
        periodTo : Date
}

//employeeMaseter
export const createEmployeeMaster = async (employeDetails : employeDetails) => {
    try {
        const {EmployeeCode, EmployeeName, Email, CapAmount, mobile, userName,} = employeDetails;

        
       
        const result = await executeStoredProcedure("Stp_Employee", [
            {name : "flag", value : "createEmployee"},
            { name: "employee_code", value: EmployeeCode },
            { name: "employee_name", value: EmployeeName },
            { name: "email", value: Email },
            { name: "mobile", value: mobile },
            { name: "userName", value: userName },
            { name: "cap_amount", value: CapAmount },
           
        ]);
        return result;
        
    }
    catch (error) {
        console.error("Error creating employee master:", error);
        throw error;
    }
}

export const getEmployeeData = async () => {
    try {
        
        const employees = await executeStoredProcedure("Stp_Employee",[
             {name : "flag", value : "getAllEmployee"}
        ]);
        return employees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

export const updateEmployee = async (employeDetails : employeDetails)=>{
    try{
        const {empId, Email, CapAmount, mobile, userName} = employeDetails;
        const employee  = await executeStoredProcedure("Stp_Employee",[
            {name : "flag", value : "updateEmployee"},
            { name: "email", value: Email },
            { name: "mobile", value: mobile },
            { name: "userName", value: userName },
            { name: "cap_amount", value: CapAmount },
            { name: "empId", value: empId },
           
        ])
         return employee;

    }
    catch(error){
       console.error("Error fetching employees:", error);
        throw error;
    }
}

//vendor master
export const createVendorMaster = async (vendorDetails : vendorDetails) => {
    try {
        const {VendorCode, VendorName, Email, Mobile} = vendorDetails;
        const result = await executeStoredProcedure("Stp_Vendor", [
            { name: "vendor_code", value: VendorCode },
            { name: "vendor_name", value: VendorName },
            { name: "email", value: Email },
            { name: "mobileNumber", value: Mobile },
            { name: "flag", value: "createVendor" }
        ]);
        return result;
        
    }
    catch (error) {
        console.error("Error creating vendor master:", error);
        throw error;
    }
}

export const getVendorData = async () => {
    try {
        const vendors = await executeStoredProcedure("Stp_Vendor",[
            { name: "flag", value: "getAllVendor" }
        ]);
        return vendors;
    } catch (error) {
        console.error("Error fetching vendors:", error);
        throw error;
    }
};

//------------------------------------------ITEM MASTER-----------------------------------
export const getItemData = async () => {
    try {
        const items = await executeStoredProcedure("Stp_ItemMaster",[
            {name : "flag",value:"GetAllItems"}
        ]);     
        return items;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};
export const createItem = async (itemsDetails : itemsDetails) => {
    try {
        const {itemName, category} = itemsDetails;
        const result = await executeStoredProcedure("Stp_ItemMaster", [
            { name: "itemName", value: itemName },
            { name: "category", value: category },
            { name: "flag", value: "CreateItem" }
        ]);
        return result;
        
    }
    catch (error) {
        console.error("Error creating item master:", error);
        throw error;
    }
}

//---------------------------------------Category--------------------------------

export const genericMasterDropdown = async (masterType : masterType) => {
    try {
        const {masterTypeId} = masterType; 
        const category = await executeStoredProcedure("Stp_ItemMaster",[
            {name : "flag",value:"GetCategory"},
            {name : "masterTypeId",value : masterTypeId}
        ]);
       /// console.log(category);
        
        return category;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};


//price master
export const getPriceData = async () => {
    try {
        const price = await executeStoredProcedure("Stp_PriceMAster",[
            {name : "flag",value:"GetAllPrice"},
            {name : "itemId",value:null},
            {name : "price",value:null},
            {name : "periodFrom",value:null},
            {name : "periodTo",value:null}
        ]);     
      // console.log(price)
        return price;
    } catch (error) {
        console.error("Error fetching price:", error);
        throw error;
    }
};


export const createPrice = async (priceDetails : priceDetails) => {
    try {
        const {itemId,price,periodFrom, periodTo} = priceDetails;
        const result = await executeStoredProcedure("Stp_PriceMAster", [
            { name: "itemId", value: itemId },
            { name: "price", value: price },
            { name: "periodFrom", value: periodFrom },
            { name: "periodTo", value: periodTo },
            { name: "flag", value: "CreateItem" }
        ]);
        return result;
        
    }
    catch (error) {
        console.error("Error creating item master:", error);
        throw error;
    }
}

export const getCategorySpecificData = async (category: number) => {
    try {
        const price = await executeStoredProcedure("Stp_ItemMaster",[
            {name : "flag",value:"getCategorySpecific"},
            {name : "category",value:category}
        ]);     
      // console.log(price)
        return price;
    } catch (error) {
        console.error("Error fetching price:", error);
        throw error;
    }
};



