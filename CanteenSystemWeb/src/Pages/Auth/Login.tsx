import { Button, Card, Form, Input, Modal, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const { Title, Text } = Typography;
import toast from "react-hot-toast";
import API from "../../API/API";
import {
  forgetPass,
  loginUser,
  OTPVerify,
  updatePassword,
} from "../../API/endpoints";
import axios from "axios";
import ForgetPassWordModal from "./ForgetPassWordModal";
import ConfirmCodeModal from "./ConfirmCodeModal";
import ResetPasswordModal from "./ResetPasswordModal";

type LoginFormValues = {
  user: string;
  password: string;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, SetLoginType] = useState("admin");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [isResetOpen, setIsResetOpen] = useState(false);

  const userLogin = async (payload: any) => {
    try {
      const response = await API.post(loginUser, payload);
      const data = response.data.user;

      login(data.role, data.Username);
      localStorage.setItem("userId", data.EmpId);
      localStorage.setItem("userName", data.Username);
      toast.success("Login Successful!");

      if (data.role === "SuperAdmin") {
        navigate("/master");
        return;
      }
      if (data.role === "Admin") {
        navigate("/admin/inventory");
        return;
      }
      if (data.role === "SuperUser") {
        navigate("/admin/orders");
        return;
      }
      navigate("/user/home");
    } catch (error: any) {
      // ❗ Runs for 401, 400, 500, etc.
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Login failed";

        if (status === 401) {
          toast.error(message); // ❗ invalid credentials
        }
        if (status === 404) {
          toast.error("User Not Found");
        }

        console.log("Backend error:", status, error.response.data);
      } else {
        toast.error("Network error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    const payload = {
      userName: values.user,
      password: values.password,
      loginType: "User",
    };
    await userLogin(payload);
  };
  const handleSendCode = async (UserName: string) => {
    try {
      const response = await API.post(forgetPass, { userName: UserName });
      localStorage.setItem("OtpUserName", UserName);
      setIsForgotOpen(false);
      setIsOtpOpen(true);
      toast.success(
        `Code Sent Successfully to mail "admin.hr@canimagemediatech.com"`,
      );
    } catch (error: any) {
      console.error("Error Data", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };
  const handleVerifyCode = async (code: string) => {
    const OtpUserName = localStorage.getItem("OtpUserName");

    try {
      const response = await API.post(OTPVerify, {
        userName: OtpUserName,
        code: code,
      });
      if (response.status === 200) {
        const empID = response.data.user.EmpId;
        localStorage.setItem("tempEmpId", empID);
        setIsResetOpen(true);
        toast.success("Code Verification Sucessfull");
      }
    } catch (error) {
      toast.error("Error Data");
    }

    setIsOtpOpen(false);
  };
  const handleForgotPassword = async () => {
    setIsForgotOpen(true);
  };
  const handlePasswordUpdate = async (newPassword: string) => {
    try {
      const tempEmpId = localStorage.getItem("tempEmpId");
      const response = await API.post(updatePassword, {
        newPassword: newPassword,
        empId: tempEmpId,
      });
      if (response.status === 200) {
        setIsResetOpen(false);
        toast.success("Password Updated Sucessfully");
        localStorage.clear();
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/canbig.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/65"></div>

        <Card className="w-full max-w-md shadow-lg">
          <div className="mb-4 text-center">
            <Title level={3} className="!mb-1">
              Login
            </Title>
            <Text type="secondary">Please login to your account</Text>
          </div>

          <Form<LoginFormValues>
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* user */}
            <Form.Item
              label="User Name"
              name="user"
              rules={[
                { required: true, message: "Please enter your User Name" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your user name"
                size="large"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            {/* Submit */}
            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
          <p
            onClick={handleForgotPassword}
            className="flex items-center justify-center text-blue-600 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>
        </Card>
      </div>
      <ForgetPassWordModal
        open={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSend={handleSendCode}
        username={username}
        setUsername={setUsername}
      />
      <ConfirmCodeModal
        open={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerify={handleVerifyCode}
      />
      <ResetPasswordModal
        open={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSubmit={handlePasswordUpdate}
      />
    </>
  );
}
