import { executeStoredProcedure } from "../config/dbconfig";

export const getWallet = async () => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "getWallets" }
        ]);
        return wallet;
    } catch (error) {
        console.error("Error fetching wallet:", error);
        throw error;
    }
};
export const GetWalletDashboard = async () => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "GetWalletDashboard" }
        ]);
        return wallet;
    } catch (error) {
        console.error("Error fetching wallet:", error);
        throw error;
    }
};
export const getWalletLogs = async () => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "walletLogs" }
        ]);
        return wallet;
    } catch (error) {
        console.error("Error fetching wallet logs:", error);
        throw error;
    }
};
export const RechargeWallet = async (amount: number, walletId: string) => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "RechargeWallet" },
            { name: "AddAmnt", value: amount },
            { name: "walletId", value: walletId }
        ]);
        return wallet;
    } catch (error) {
        console.error("Error Recharging wallet:", error);
        throw error;
    }
};

export const getUserWallet = async (empId: number) => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "UserWallet" },
            { name: "empId", value: empId }
        ]);
        return wallet;
    } catch (error) {
        console.error("Error fetching user wallet:", error);
        throw error;
    }
};


export const getWalletLogsForUser = async (empId: number) => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "walletLogsForUser" },
            { name: "empId", value: empId }
        ]);
        //console.log(wallet);
        return wallet;
    } catch (error) {
        console.error("Error fetching wallet logs:", error);
        throw error;
    }
};
export const updateCAP = async (empId: number, remCap : number ) => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "updateCap" },
            { name: "empId", value: empId },
            { name: "remCap", value: remCap },
        ]);
        
        return wallet;
    } catch (error) {
        console.error("Error fetching wallet logs:", error);
        throw error;
    }
};
export const walletSpecificUser = async (walletId: number ) => {
    try {
        const wallet = await executeStoredProcedure("Stp_Wallet", [
            { name: "flag", value: "employeeExcel" },
            { name: "walletId", value: walletId }
        ]);
       
        return wallet;
    } catch (error) {
        console.error("Error fetching wallet logs:", error);
        throw error;
    }
};
