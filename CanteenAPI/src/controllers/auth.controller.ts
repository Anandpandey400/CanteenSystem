import { Request, Response } from "express";
import { adminLogin, ForgetPassword, GetUserDetailsByUserName, updatePassword, verifyOTp, } from "../services/user.service";
import { verifyPassword } from "../config/password";


export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { userName, password, loginType } = req.body;

    if (!userName || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // // ===== Admin Login =====
    // if (loginType === "admin") {
    //   try {
    //     const admins = await adminLogin(userName, password); // async function returning array

    //     if (!admins || admins.length === 0) {
    //       res.status(404).json({ message: "Admin not found" });
    //       return; // ✅ return after sending response
    //     }

    //     const admin = admins[0];

    //     if (admin?.Password !== password) {
    //       res.status(401).json({ message: "Invalid password" });
    //       return; // ✅ return after sending response
    //     }

    //     // login successful
    //     res.status(200).json({ message: "Login successful", admin });
    //     return; // ✅ return to stop further execution
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: "Internal server error" });
    //     return;
    //   }
    // }

    // ===== User Login =====
    const userData = await GetUserDetailsByUserName(userName);

    if (!userData || userData.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = userData[0];
    const isValid = await verifyPassword( password, user.Password)


  if (!isValid){
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    res.status(200).json({ message: "Login successful", user });  
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to login user" });
  }
}

export async function forgetPass(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { userName } = req.body;

    const passRes = await ForgetPassword(userName);

    if (passRes.success) {
      return res.status(200).json(passRes);
    }

    return res.status(400).json(passRes); // use 400 instead of 500 for logical failure

  } catch (error) {
    console.error("Error in forgetPass:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function OTPVerify(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { userName, code } = req.body;

    const verify = await verifyOTp(userName, code);

    if (!verify.success) {
      return res.status(400).json(verify);
    }

    return res.status(200).json(verify);

  } catch (error) {
    console.error("Error in OTPVerify:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function updatePasswordData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { newPassword, empId } = req.body;

    const verify = await updatePassword(newPassword, empId);

     res.status(200).json({message : "Password Updated",verify});

  } catch (error) {
    console.error("Error in OTPVerify:", error);

     res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
