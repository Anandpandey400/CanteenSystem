import { Request, Response } from "express";
import { ChangePassword, GetUserDetailsByEmpId, getUsers as getUsersService, validateUser } from "../services/user.service";
import { verifyPassword } from "../config/password";

export async function getUsers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
export async function ChangePasswordData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {empId, inputpassword, NewPass} = req.body
       if (!empId || !inputpassword || !NewPass) {
      res.status(400).json({ message: "Employee ID and password are required" });
      return;
    }
    const userData = await GetUserDetailsByEmpId(empId);
    if (!userData || userData.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const user = userData[0];
     const isValid = await verifyPassword( inputpassword, user.Password)
     
  if (!isValid){
      res.status(401).json({ message: "Invalid Current Password" });
      return;
    }

    const userPassChange = await ChangePassword(empId,inputpassword,NewPass)

    res.status(200).json({ message: "PassWord Changed Sucessfully", userPassChange }); 



  } catch (error) {
    console.error("Error Updating Password:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
