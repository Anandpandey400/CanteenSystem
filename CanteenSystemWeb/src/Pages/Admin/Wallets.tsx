import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Search, Wallet, TrendingUp, Wallet2, ScrollText } from "lucide-react";

import type { Employee } from "../../types";
import { Table, Tooltip } from "antd";
import API from "../../API/API";
import {
  getWallet,
  getWalletDashboard,
  getWalletLogs,
  rechargeWallet,
  updateCAP,
  walletSpecificUser,
} from "../../API/endpoints";
import { Modal, Typography } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  formatAsLocal12Hr,
  formatDateTimeForExcel,
} from "../../utils/AllUtils";

interface Dashboard {
  totalActiveWallets: number;
  totalBalance: number;
  lowBalanceWallets: number;
}

export default function Wallets() {
  const { Text } = Typography;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [wallDashboard, setWallDashboard] = useState<Dashboard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [capBalance, setCapBalance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number | null>(null);
  const [payOffAmnt, setPayOffAmnt] = useState<number | null>(null);
  const [walletLogs, setWalletLogs] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchWalletDashboard();
    fetchWalletLogs();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await API.get(getWallet);
      if (response.status === 200) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchWalletDashboard = async () => {
    try {
      const response = await API.get(getWalletDashboard);
      if (response.status === 200) {
        setWallDashboard(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchWalletLogs = async () => {
    try {
      const response = await API.get(getWalletLogs);
      if (response.status === 200) {
        setWalletLogs(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const handleRecharge = async (walletId: string, amount: number) => {
    console.log("Recharging", walletId, "with amount", amount);
    try {
      const payload = {
        walletId,
        amount: amount,
      };
      const response = await API.post(rechargeWallet, payload);
      if (response.status === 200) {
        setSelectedEmployee(null);
        fetchEmployees();
        fetchWalletLogs();
        fetchWalletDashboard();
        setIsRechargeDialogOpen(false);
        toast.success("Wallet recharged successfully");
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const exportWalletLogs = () => {
    const headers = [
      "Date",
      "Time",
      "Employee Name",
      "Employee Code",
      "Type",
      "Amount",
      "Description",
      "Balance After",
    ];

    const rows = walletLogs.map((log: any) => {
      const dateObj = new Date(log.createdAt);

      const date = dateObj.toLocaleDateString("en-IN");
      const time = dateObj.toLocaleTimeString("en-IN");

      return [
        date,
        time,
        log.employee_name,
        log.employee_code,
        log.actionType,
        log.changeAmnt.toFixed(2),
        log.description,
        log.balanceAmnt.toFixed(2),
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      dayjs().format("YYYYMMDD_HHmmss") + "_wallet_logs.csv",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      employee.employee_name?.toLowerCase().includes(query) ||
      employee.employee_code?.toLowerCase().includes(query) ||
      employee.id?.toString().includes(query)
    );
  });
  const handlePendingBalance = (rec: any) => {
    setCapBalance(true);
    setSelectedEmployee(rec);
  };

  const uniqueValuesWallet = (data: any[], key: string) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).map(
      (val) => ({
        text: val,
        value: val,
      }),
    );
  const handleExcelExport = async (
    walletId: number,
    employeeName: string,
    employeeCode: string,
  ) => {
    try {
      const response = await API.post(walletSpecificUser, {
        walletId,
      });

      if (response.status === 200) {
        const logs = response.data.data;
        console.log("RAW logs:", logs);

        const headers = [
          "Date",
          "Time",
          "Employee Code",
          "Employee Name",
          "Order Id",
          "Order Items",
          "Order Amount",
          "Payment Mode",
          "Type",
          "Prev Balance",
          "Change Amount",
          "New Balance",
        ];

        const rows = logs.map((log: any) => {
          const { date, time } = formatDateTimeForExcel(log.date); // ✅ FIX

          return [
            date, // Date column
            time, // Time column
            log.employee_code,
            log.employee_name,
            log.OrderId,
            `"${log.OrderItems}"`,
            log.amount,
            log.paymentMode,
            log.actionType,
            Number(log.prevAmnt).toFixed(2),
            Number(log.changeAmnt).toFixed(2),
            Number(log.newAmnt).toFixed(2),
          ];
        });

        const csvContent =
          "data:text/csv;charset=utf-8," +
          [headers, ...rows]
            .map((row) => row.map(String).join(",")) // safer
            .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `${employeeName}_${employeeCode}_wallet_logs.csv`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const walletColumns = [
    {
      title: "Employee ID",
      dataIndex: "id",
      key: "employeeId",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_name.localeCompare(b.employee_name),
      filters: uniqueValuesWallet(filteredEmployees, "employee_name"),
      onFilter: (value: any, record: any) => record.employee_name === value,
    },
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      key: "employee_code",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_code.localeCompare(b.employee_code),
      filters: uniqueValuesWallet(filteredEmployees, "employee_code"),
      onFilter: (value: any, record: any) => record.employee_code === value,
    },
    {
      title: "Wallet Balance (₹)",
      dataIndex: "balance",
      key: "balance",
      responsive: ["xs", "sm", "md", "lg"],

      render: (balance: number) => (
        <span
          style={{
            color: balance < 10 ? "red" : "inherit",
            fontWeight: balance < 10 ? 600 : 400,
          }}
        >
          ₹{balance.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: "Pending Balance (₹)",
      dataIndex: "capBalance",
      key: "capBalance",
      responsive: ["xs", "sm", "md", "lg"],
      render: (capBalance: number = 0, rec: any) => {
        const isClickable = capBalance > 0;

        return (
          <Tooltip
            title={
              isClickable
                ? "Click to view pending balance details"
                : "No pending balance"
            }
          >
            <span
              onClick={() => isClickable && handlePendingBalance(rec)}
              className={`
            inline-flex items-center
            font-medium
            ${isClickable ? "text-blue-600 cursor-pointer hover:underline" : "text-gray-400 cursor-not-allowed"}
          `}
            >
              ₹{capBalance.toLocaleString("en-IN")}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["xs", "sm", "md", "lg"],
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      sorter: (a: any, b: any) => Number(a.status) - Number(b.status),
      render: (status: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Last Recharge",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (updatedAt: string) => formatAsLocal12Hr(updatedAt),
    },
    {
      title: "Actions",
      key: "actions",
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, record: Employee) => (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedEmployee(record);
              setRechargeAmount(null);
              setIsRechargeDialogOpen(true);
            }}
          >
            <Wallet2 className="w-4 h-4 mr-1" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              handleExcelExport(
                record.id,
                record.employee_name,
                record.employee_code,
              );
            }}
          >
            <ScrollText className="w-4 h-4 mr-1" />
          </Button>
        </div>
      ),
    },
  ];

  const uniqueValues = (data: any[], key: string) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).map(
      (val) => ({
        text: val,
        value: val,
      }),
    );

  const walletLogsColumns = [
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["xs", "sm", "md", "lg"],
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
      filters: uniqueValues(walletLogs, "employee_name"),
      onFilter: (value: any, record: any) => record.employee_name === value,
    },
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      key: "employee_code",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_code.localeCompare(b.employee_code),
      filters: uniqueValues(walletLogs, "employee_code"),
      onFilter: (value: any, record: any) => record.employee_code === value,
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
      sorter: (a: any, b: any) => a.actionType.localeCompare(b.actionType),
      render: (actionType: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            actionType === "Credit"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {actionType}
        </span>
      ),
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
      render: (paymentMode: string) => <span>{paymentMode || "-"}</span>,
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
            record.actionType === "Credit" ? "text-green-600" : "text-red-600"
          }`}
        >
          {record.actionType === "Credit" ? "+" : "-"}₹{changeAmnt.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        (a.description || "").localeCompare(b.description || ""),
      filters: uniqueValues(walletLogs, "description"),
      onFilter: (value: any, record: any) => record.description === value,
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
  const handlePayOff = async (id: number, amnt: number) => {
    setLoading(true);
    if (amnt > selectedEmployee.capBalance) {
      toast.error("Amount Cannot be greater than CAP");
      return;
    }
    try {
      const payload = {
        empId: id,
        remCap: amnt,
      };
      const response = await API.post(updateCAP, payload);
      if (response.status === 200) {
        setSelectedEmployee(null);
        fetchEmployees();
        setCapBalance(false);
        toast.success("CAP Paid Off Sucessfully");
      }
    } catch (error) {
      console.error("Error Data", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Wallet Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employee wallets and recharges
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          <Input
            placeholder="Search by name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
      pl-10
      bg-white
      border border-gray-200
      rounded-lg
      shadow-sm
      text-gray-800
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      transition
      duration-200
    "
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Active Wallets</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">
                {wallDashboard.totalActiveWallets}
              </p>
            </div>
            <div className="w-9 h-9 bg-blue-100 rounded-md flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Balance</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">
                ₹{wallDashboard?.totalBalance?.toLocaleString("en-IN") ?? "0"}
              </p>
            </div>
            <div className="w-9 h-9 bg-green-100 rounded-md flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Low Balance Wallets</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">
                {wallDashboard.lowBalanceWallets}
              </p>
            </div>
            <div className="w-9 h-9 bg-yellow-100 rounded-md flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}

      {/* Employees Table */}
      <Card className="overflow-hidden">
        <Table
          className="thin-table"
          dataSource={filteredEmployees}
          rowKey="id"
          size="small"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 10 }}
          columns={walletColumns}
          rowClassName={(record) => (record.balance <= 10 ? "bg-red-100" : "")}
        />

        {/* Recharge Dialog */}
      </Card>

      {/* Transaction Ledger */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
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
          className="thin-table"
          dataSource={walletLogs}
          size="small"
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 5 }}
          columns={walletLogsColumns}
        />
      </Card>

      <Modal
        title="Recharge Wallet"
        open={isRechargeDialogOpen}
        onCancel={() => {
          setIsRechargeDialogOpen(false);
          setSelectedEmployee(null);
        }}
        footer={null}
        centered
      >
        {selectedEmployee && (
          <div className="space-y-4">
            {/* Employee Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text type="secondary">Employee</Text>
              <div className="font-semibold text-gray-900">
                {selectedEmployee.employee_name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedEmployee.employee_code}
              </div>
            </div>

            {/* Current Balance */}
            <div>
              <Text>Current Balance</Text>
              <Input
                disabled
                value={`₹${selectedEmployee.balance.toFixed(2)}`}
              />
            </div>

            {/* Recharge Amount */}
            <div>
              <Text>Recharge Amount</Text>
              <Input
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount ?? ""}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[100, 200, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  onClick={() => setRechargeAmount(amount)}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setIsRechargeDialogOpen(false);
                  setSelectedEmployee(null);
                }}
              >
                Cancel
              </Button>

              <Button
                style={{ backgroundColor: "#16A34A" }}
                className="flex-1"
                disabled={!rechargeAmount || rechargeAmount <= 0}
                onClick={() => {
                  handleRecharge(selectedEmployee.id, rechargeAmount);
                }}
              >
                Confirm Recharge
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="CAP Pay Off"
        open={capBalance}
        onCancel={() => {
          setCapBalance(false);
          setSelectedEmployee(null);
        }}
        footer={null}
        centered
      >
        {selectedEmployee && (
          <div className="space-y-4">
            {/* Employee Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text type="secondary">Employee</Text>
              <div className="font-semibold text-gray-900">
                {selectedEmployee.employee_name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedEmployee.employee_code}
              </div>
            </div>

            {/* Current Balance */}
            <div>
              <Text>Current CAP</Text>
              <Input disabled value={`₹${selectedEmployee.capBalance}`} />
            </div>

            {/* Recharge Amount */}
            <div>
              <Text>Pay Off Cap</Text>
              <Input
                type="number"
                placeholder="Enter amount"
                value={payOffAmnt ?? ""}
                onChange={(e) => setPayOffAmnt(Number(e.target.value))}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setCapBalance(false);
                  setSelectedEmployee(null);
                }}
              >
                Cancel
              </Button>

              <Button
                style={{ backgroundColor: "#16A34A" }}
                className="flex-1"
                disabled={!payOffAmnt || payOffAmnt <= 0 || loading}
                onClick={() => {
                  handlePayOff(selectedEmployee.id, payOffAmnt);
                }}
              >
                {loading ? "Loading..." : "Confirm PayOff"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
