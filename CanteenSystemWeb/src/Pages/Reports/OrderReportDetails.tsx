import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Search, Eye, Download, RefreshCwIcon } from "lucide-react";
import type { Order } from "../../types";
import API from "../../API/API";
import { specificOrderData } from "../../API/endpoints";
import { Table } from "antd";
import { formatAsLocal12Hr } from "../../utils/AllUtils";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {};

function OrderReportDetails({}: Props) {
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const payload = {
        empId: id,
      };
      const response = await API.post(specificOrderData, payload);
      if (response.status === 200) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    InProgress: " text-yellow-700 font-bold",
    Ready: " text-blue-700 font-bold",
    Completed: " text-green-700 font-bold",
    Cancelled: " text-red-700 font-bold",
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      order.OrderId?.toString().toLowerCase().includes(query) ||
      order.employee_name?.toLowerCase().includes(query)
    );
  });
  const uniqueValues = (data: any[], key: string) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).map(
      (val) => ({
        text: val,
        value: val,
      }),
    );

  const ordersColumns = [
    {
      title: "Order ID",
      dataIndex: "OrderId",
      key: "OrderId",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.OrderId.localeCompare(b.OrderId),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_name.localeCompare(b.employee_name),
      filters: uniqueValues(filteredOrders, "employee_name"),
      onFilter: (value: any, record: any) => record.employee_name === value,
    },
    {
      title: "Items",
      dataIndex: "itemQuantity",
      key: "itemQuantity",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.itemQuantity - b.itemQuantity,
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (amount: number) => `₹${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["xs", "sm", "md", "lg"],
      filters: uniqueValues(filteredOrders, "status"),
      onFilter: (value: any, record: any) => record.status === value,
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <p className={`${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
          {status}
        </p>
      ),
    },
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
      title: "Actions",
      key: "actions",
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, record: Order) => (
        <div className="flex gap-2">
          <Eye
            onClick={() => {
              setSelectedOrder(record);
              setIsDetailDialogOpen(true);
            }}
            className="w-4 h-4 ml-2"
          />
        </div>
      ),
    },
  ];

  const handleExcelDownload = () => {
    const headers = [
      "Order ID",
      "Employee Name",
      "Items",
      "Total Amount",
      "Status",
      "Date & Time",
    ];

    const rows = orders.map((order) => [
      order.OrderId,
      order.employee_name,
      order.itemQuantity,
      order.amount,
      order.status,
      order.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all orders
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExcelDownload}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            {loading ? (
              <>
                <RefreshCwIcon className="animate-spin w-4 h-4 spin " />
              </>
            ) : (
              <>
                <RefreshCwIcon className="w-4 h-4" />
              </>
            )}
          </Button>

          <div className="relative w-72">
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
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <Table
          className="thin-table"
          rowKey="id"
          size="small"
          dataSource={filteredOrders}
          columns={ordersColumns}
          scroll={{ x: 900 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "20", "50", "100"],
          }}
        />
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.OrderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[selectedOrder.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.employee_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.employee_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatAsLocal12Hr(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Order Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.menuName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.Quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.Quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{selectedOrder.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  style={{ backgroundColor: "#2563EB" }}
                  className="flex-1"
                >
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderReportDetails;
