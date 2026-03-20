import { Request, Response } from "express";
import { getUserWallet, getWallet, GetWalletDashboard, getWalletLogs, getWalletLogsForUser, RechargeWallet, updateCAP, walletSpecificUser } from "../services/walllet.sevice";

export async function getWalletData(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const wallet = await getWallet();
        res.status(200).json({ message: "Wallet Data Fetched", data: wallet });
    } catch (error) {

        console.error("Error fetching wallet:", error);
        res.status(500).json({ message: "Failed to fetch wallet data" });
    }
}
export async function getWalletDashboardData(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const wallet = await GetWalletDashboard();
        res.status(200).json({ message: "Wallet Data Fetched", data: wallet });
    } catch (error) {

        console.error("Error fetching wallet:", error);
        res.status(500).json({ message: "Failed to fetch wallet data" });
    }
}
export async function getWalletLogsData(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const wallet = await getWalletLogs();
        res.status(200).json({ message: "Wallet Logs Fetched", data: wallet });
    } catch (error) {

        console.error("Error fetching wallet logs:", error);
        res.status(500).json({ message: "Failed to fetch wallet logs" });
    }
}

export async function rechargeWallet(
    req: Request,
    res: Response   
): Promise<void> {
    try {
        const { amount, walletId } = req.body;
        const wallet = await RechargeWallet(amount, walletId);
        res.status(200).json({ message: "Wallet Recharged Successfully", data: wallet });
    } catch (error) {
        console.error("Error recharging wallet:", error);

        res.status(500).json({ message: "Failed to recharge wallet" });
    }
}
export async function getUserWalletData(
    req: Request,
    res: Response
): Promise<void> {
    try {
       const { empId } = req.body;
        const wallet = await getUserWallet(empId);
        res.status(200).json({ message: "User Wallet Fetched", data: wallet });
    } catch (error) {
        console.error("Error fetching user wallet:", error);
        res.status(500).json({ message: "Failed to fetch user wallet" });
    }
}
export async function getWalletLogsDataForUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { empId } = req.body;
        const wallet = await getWalletLogsForUser(empId);
        res.status(200).json({ message: "Wallet Logs Fetched", data: wallet });
    } catch (error) {

        console.error("Error fetching wallet logs:", error);
        res.status(500).json({ message: "Failed to fetch wallet logs" });
    }
}
export async function updateCapData(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { empId, remCap } = req.body;
        const wallet = await updateCAP(empId,remCap);
        res.status(200).json({ message: "CAP updated", data: wallet });
    } catch (error) {

        console.error("Error fetching wallet logs:", error);
        res.status(500).json({ message: "Failed to update cap logs" });
    }
}
export async function walletSpecificUserData(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { walletId } = req.body;
        const wallet = await walletSpecificUser(walletId);
        res.status(200).json({ message: "Wallet Data Fetched", data: wallet });
    } catch (error) {

        console.error("Error fetching wallet logs:", error);
        res.status(500).json({ message: "Failed to fetch wallet data" });
    }
}
