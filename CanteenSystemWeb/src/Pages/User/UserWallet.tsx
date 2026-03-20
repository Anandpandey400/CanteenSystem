import React, { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Wallet } from "lucide-react";
import { Button } from "../../ui/button";
import { Table } from "antd";
import { getUserWallet, getWalletLogsForUser } from "../../API/endpoints";
import API from "../../API/API";
import { formatAsLocal12Hr } from "../../utils/AllUtils";

type UserWalletProps = {
  balance?: number;
  currency?: string;
  growthPercent?: number;
};

const UserWallet: React.FC<UserWalletProps> = ({
  currency = "₹",
  growthPercent = 0,
}) => {
  const isPositive = growthPercent >= 0;
  const [walletLogs, setWalletLogs] = useState([]);
  const userId = localStorage.getItem("userId");
  const [userWallet, setUserWallet] = useState({
    id: 0,
    balance: 0,
    name: "",
    empCode: "",
  });

  useEffect(() => {
    fetchWalletLogs();
    fetchUserWalletDetails(parseInt(userId));
  }, []);

  const fetchWalletLogs = async () => {
    try {
      const payload = {
        empId: parseInt(userId),
      };
      const response = await API.post(getWalletLogsForUser, payload);
      if (response.status === 200) {
        setWalletLogs(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchUserWalletDetails = async (userId: number) => {
    try {
      const payload = {
        empId: userId,
      };
      const response = await API.post(getUserWallet, payload);
      if (response.status === 200) {
        setUserWallet(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const walletLogsColumns = [
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (createdAt: string) => formatAsLocal12Hr(createdAt),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_name.localeCompare(b.employee_name),
    },
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      key: "employee_code",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_code.localeCompare(b.employee_code),
    },
    {
      title: "Paymeny Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      responsive: ["xs", "sm", "md", "lg"],
      filters: [
        { text: "CAP", value: "CAP" },
        { text: "WALLET", value: "WALLET" },
        { text: "MIXED", value: "MIXED" },
      ],
      onFilter: (value: any, record: any) => record.paymentMode === value,
    },
    {
      title: "Type",
      dataIndex: "actionType",
      key: "actionType",
      responsive: ["xs", "sm", "md", "lg"],
      filters: [
        { text: "Credit", value: "Credit" },
        { text: "Debit", value: "Debit" },
      ],
      onFilter: (value: any, record: any) => record.actionType === value,
      render: (actionType: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            actionType === "Credit" ||
            actionType === "CREDIT" ||
            actionType === "FOS-CAP" ||
            actionType === "Refund-CAP"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {actionType}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "changeAmnt",
      key: "changeAmnt",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.changeAmnt - b.changeAmnt,
      render: (changeAmnt: number, record: any) => (
        <span
          className={`text-sm font-semibold ${
            record.actionType === "Credit" ||
            record.actionType === "CREDIT" ||
            record.actionType === "FOS-CAP" ||
            record.actionType === "Refund-CAP"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {record.actionType === "FOS-CAP" ||
          record.actionType === "Refund-CAP" ||
          record.actionType === "Credit" ||
          record.actionType === "CREDIT"
            ? "+"
            : "-"}
          ₹{changeAmnt.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: "Balance After (₹)",
      dataIndex: "balanceAmnt",
      key: "balanceAmnt",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.balanceAmnt - b.balanceAmnt,
      render: (balanceAmnt: number) => `₹${balanceAmnt.toFixed(2)}`,
    },
  ];

  const exportWalletLogs = () => {
    const headers = walletLogsColumns.map((col) => col.title);
    const rows = walletLogs.map((log: any) => [
      log.createdAt,
      log.employee_name,
      log.employee_code,
      log.actionType,
      log.changeAmnt,
      log.description,
      log.balanceAmnt,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wallet_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      {/* Wallet Card */}
      <Card className="relative overflow-hidden p-6">
        {/* Gradient strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet */}
          <div className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">My Wallet Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                {currency} {userWallet.balance.toLocaleString()}
              </p>
            </div>

            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-blue-600" />
            </div>
          </div>

          {/* CAP */}
          <div className="flex items-center justify-between p-4 ">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">My CAP Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                {currency} {userWallet.cap_amount}
              </p>
            </div>

            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportWalletLogs()}
          >
            Export
          </Button>
        </div>
        <Table
          dataSource={walletLogs}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5 }}
          columns={walletLogsColumns}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default UserWallet;
