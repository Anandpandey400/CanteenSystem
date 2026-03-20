import { executeStoredProcedure } from "../config/dbconfig";
import { sendEmail } from "../config/email";
import { generate4DigitCode, hashPassword } from "../config/password";

interface user {
  Id: number;
  Username: string;
  Password: string;
  role: string;
  EmpId: string;
  RoleId: number;
}

export const getUsers = async () => {
    try {
        const users = await executeStoredProcedure("Stp_GetAllUsers");
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const validateUser = async (Username: string) => {
    try {
        const data = await executeStoredProcedure("Stp_GetUserDetailsById", [
            { name: "Username", value: Username },
        ]);
        return data;
    } catch (error) {
        console.error("Error validating user:", error);
        throw error;
    }
}

export const GetUserDetailsByUserName = async (Username: string) => {
    try {
        const data = await executeStoredProcedure("Stp_UserLogin", [
            { name: "Username", value: Username },
            { name: "flag", value: "GetDataByUserName" }
        ]);
        return data;
    } catch (error) {
        console.error("Error fetching user details by UserId:", error);
        throw error;
    }
}
export const GetUserDetailsByEmpId = async (empId: string | number) => {
    try {
        const data = await executeStoredProcedure("Stp_UserLogin", [
            { name: "empId", value: empId },
            { name: "flag", value: "GetDataByUserId" }
        ]);
        return data;
    } catch (error) {
        console.error("Error fetching user details by UserId:", error);
        throw error;
    }
}


export const adminLogin = async (Username: string, Password: string) => {
    try {
        const data = await executeStoredProcedure("Stp_AdminLogin", [   
            { name: "Username", value: Username },
            { name: "Password", value: Password }
        ]);
        return data;
    } catch (error) {
        console.error("Error during admin login:", error);
        throw error;
    }
};
export const ChangePassword = async(empId: Number, inputpassword : string, NewPass : string)=>{
    try{
        const hasPass = await hashPassword(NewPass)
        const data = await executeStoredProcedure("Stp_ChangePassword", [
            { name: "empId", value: empId },
            { name: "NewPass", value: hasPass }
        ])
         return data;
    }catch(error) {
        console.error("Error during Password change :", error);
        throw error;
    }
}

export const manageForgetCode = async (type: string, code : string | number , userId :  number, userName : string)=>{
try{
    if(type === "SETCODE"){
         const users = await executeStoredProcedure("Stp_UserLogin",[
            { name: "empId", value: userId },
            { name: "Code", value: code },
            { name: "flag", value: "AddCode" }
        ]);
        return users;
    }
     const users = await executeStoredProcedure("Stp_UserLogin",[
            { name: "UserName", value: userName },
            { name: "flag", value: "GetCode" }
        ]);
        return users;

} catch(error){
console.error("Error Data" ,error);
}
}

export const ForgetPassword = async (userName: string) => {
  try {
    const users = await GetUserDetailsByUserName(userName);

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const userDetails = users[0];
    const resetCode = generate4DigitCode();

    const res = await sendEmail({
      to: "admin.hr@canimagemediatech.com",
      subject: `Forget Password Reset Code [Canteen Module]`,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;"> <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);"> <h2 style="color: #2c3e50; text-align: center;">CIMT - Canteen Management System</h2> <p style="font-size: 16px; color: #333;"> Hello <strong>${userDetails.Username}</strong>, </p> <p style="font-size: 15px; color: #555;"> We received a request to reset your password for the Canteen Module. </p> <p style="font-size: 15px; color: #555;"> Your password reset code is: </p> <div style="text-align: center; margin: 20px 0;"> <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #ffffff; background-color: #007bff; padding: 10px 20px; border-radius: 6px;"> ${resetCode} </span> </div> <p style="font-size: 14px; color: #777;"> This code is valid for a limited time. Please do not share this code with anyone. </p> <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" /> <p style="font-size: 14px; color: #555;"> If you did not request this password reset, please ignore this email. </p> <p style="font-size: 15px; color: #333; margin-top: 30px;"> Regards,<br/> <strong>Canteen Module Team</strong><br/> CIMT </p> </div> </div>`,
    });

    if (!res.success) {
      return {
        success: false,
        message: "Email sending failed",
      };
    }

     await manageForgetCode("SETCODE", resetCode, userDetails.Id, "empty")
    return {
      success: true,
      message: "Reset code sent successfully",
    };

  } catch (error) {
    console.error("Error during Password Forget :", error);
    throw error;
  }
};

export const verifyOTp = async(userName : string, code : number)=>{
    try {
  const user = await manageForgetCode("GETCODE", 1234, 124, userName);

  if (!user || user.length === 0) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const userDetails = user[0];

  if (!userDetails.forgetCode) {
    return {
      success: false,
      message: "Reset code not found or expired",
    };
  }

  const storedCode = Number(userDetails.forgetCode);
  const enteredCode = Number(code);

  if (storedCode !== enteredCode) {
    return {
      success: false,
      message: "Invalid reset code",
    };
  }

  // ✅ Code matched
  return {
    success: true,
    message: "Code verified successfully",
    user: userDetails,
  };

} catch (error) {
  console.error("Error Data", error);

  return {
    success: false,
    message: "Internal server error",
  };
}

}

export const updatePassword = async(newPassword: string, empId: number) =>{
try{
    const hashedPassword = await hashPassword(newPassword)
    //console.log("has", hashedPassword)
const updated = await executeStoredProcedure("Stp_UserLogin",[
            { name: "passWord", value:hashedPassword  },
            { name: "empId", value: empId },
            { name: "flag", value: "UpdatePassword" }
        ]);
        return updated; 
} catch(error){
console.error("Error Data" ,error);
}
}
