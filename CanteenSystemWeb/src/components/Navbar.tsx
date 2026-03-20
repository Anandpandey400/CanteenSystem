import { UtensilsCrossed, Menu } from "lucide-react";
import {
  Dropdown,
  Avatar,
  Drawer,
  Modal,
  Input,
  Typography,
  Button,
} from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminTabs from "./AdminTabs";
import UserTabs from "./UserTabs";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../API/API";
import { changePassword } from "../API/endpoints";

const Navbar = () => {
  const { Text } = Typography;
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const userName = localStorage.getItem("userName");
  const isAdminLike =
    role === "SuperAdmin" || role === "Admin" || role === "SuperUser";

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/");
    }
  };
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      inputpassword: currentPassword,
      NewPass: newPassword,
      empId: localStorage.getItem("userId"),
    };

    try {
      const response = await API.post(changePassword, payload);
      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setChangePass(false);
        toast.success(response.data.message);
        logout();
      }
    } catch (error: any) {
      const message = error.response.data.message;
      toast.error(message);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "username",
      label: <span className="font-medium text-gray-700">{userName}</span>,
      disabled: true,
    },

    // 👇 show only for User role
    {
      key: "change",
      label: (
        <span
          className="font-medium text-gray-700"
          onClick={() => setChangePass(true)}
        >
          Change Password
        </span>
      ),
    },

    { type: "divider" },

    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* LEFT: Logo */}
            <div className="flex items-center">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: "#2563EB" }}
              >
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Canteen System
                </h1>
                <p className="text-xs text-gray-500">
                  {isAdminLike ? "Admin Dashboard" : "User Dashboard"}
                </p>
              </div>
            </div>

            {/* CENTER: Tabs (Desktop) */}
            <div className="hidden md:flex">
              {isAdminLike ? <AdminTabs /> : <UserTabs />}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* Mobile menu */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setOpen(true)}
              >
                <Menu size={22} />
              </button>

              <Dropdown
                menu={{ items: menuItems, onClick: onMenuClick }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar
                  size={36}
                  className="bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  {userName ? (
                    userName.charAt(0).toUpperCase()
                  ) : (
                    <UserOutlined />
                  )}
                </Avatar>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        title="Menu"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        width={260}
      >
        {isAdminLike ? (
          <AdminTabs direction="horizontal" />
        ) : (
          <UserTabs direction="horizontal" />
        )}
      </Drawer>

      <Modal
        title="Change Password"
        open={changePass}
        onCancel={() => {
          setChangePass(false);
        }}
        footer={null}
        centered
      >
        <div className="space-y-6">
          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <Text className="text-sm text-gray-600">Current Password</Text>
            <Input.Password
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <Text className="text-sm text-gray-600">New Password</Text>
            <Input.Password
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
              }}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
