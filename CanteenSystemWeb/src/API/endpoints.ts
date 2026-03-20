export const loginUser =
  "/auth/login";
export const forgetPass =
  "/auth/forgetPass";
export const OTPVerify =
  "/auth/OTPVerify";
export const updatePassword =
  "/auth/updatePassword";

//dropdowmns 

export const getGenericMaster= "/master/getGenericMaster"
//change

export const changePassword= "/users/changePassword"

  //master
  export const createEmployee= "/master/createEmployee"
  export const getAllEmployees= "/master/getEmployees"
  export const updateEmployee= "/master/updateEmployee"
  export const getAllVendors= "/master/getAllVendors"
  export const createVendor= "/master/createVendor"
  export const getAllItems= "/master/getAllItems"
  export const createItem= "/master/createItem"
  export const getAllPrice= "/master/getAllPrice"
  export const createPriceMaster= "/master/createPriceMaster"
  export const getCategorySpecific= "/master/getCategorySpecific"



  //inentory
  export const getAllInventory= "/inventory/getAllInventory"
  export const getItemData= "/inventory/getItemData"
  export const createInventory= "/inventory/createInventory"
  export const StockIn= "/inventory/StockIn"
  export const getConsumptionReport= "/inventory/getConsumptionReport"
  export const getInventoryLogs= "/inventory/getInventoryLogs"
  export const wastage= "/inventory/wastage"

  //menu

  export const createMenu= "/menu/createMenu"
  export const getAllMenu= "/menu/getMenu"
  export const deleteMenu= "/menu/deleteMenu"

  //wallet
  export const getWallet= "/wallet/getWallet"
  export const getWalletDashboard= "/wallet/getWalletDashboard"
  export const rechargeWallet= "/wallet/rechargeWallet"
  export const getWalletLogs= "/wallet/getWalletLogs"
  export const getUserWallet= "/wallet/getUserWallet"
  export const updateCAP= "/wallet/updateCAP"
  export const walletSpecificUser= "/wallet/walletSpecificUser"
  export const getWalletLogsForUser= "/wallet/getWalletLogsForUser"

  //orders
  export const getOrders= "/order/getOrders"
  export const placeOrder= "/order/placeOrder"
  export const updateOrderStatus= "/order/updateOrderStatus"
  export const getSpecificOrder= "/order/getSpecificOrder"
  
  //report 
  export const getOrderReportData= "/report/getOrderReportData"
  export const specificOrderData= "/report/specificOrderData"

