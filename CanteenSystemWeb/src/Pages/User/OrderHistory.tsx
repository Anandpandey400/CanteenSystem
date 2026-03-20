import { Card, Table } from "antd";
import React, { useEffect, useState } from "react";
import type { Order } from "../../types";
import { getOrders, getSpecificOrder } from "../../API/endpoints";
import API from "../../API/API";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Eye } from "lucide-react";
import { formatAsLocal12Hr } from "../../utils/AllUtils";

type Props = {};

const OrderHistory = (props: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const payload = {
        empId: parseInt(localStorage.getItem("userId")),
      };

      const response = await API.post(getSpecificOrder, payload);
      if (response.status === 200) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const statusColors: Record<string, string> = {
    InProgress: "bg-yellow-100 text-yellow-700",
    Ready: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  const ordersColumns = [
    {
      title: "Order ID",
      dataIndex: "OrderId",
      key: "OrderId",
      sorter: (a: any, b: any) => a.OrderId.localeCompare(b.OrderId),
    },

    {
      title: "Items",
      dataIndex: "itemQuantity",
      key: "itemQuantity",
      sorter: (a: any, b: any) => a.itemQuantity - b.itemQuantity,
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (amount: number) => `₹${amount.toFixed(2)}`,
    },
    {
      title: "Order Items",
      dataIndex: "OrderItems",
      key: "OrderItems",
      responsive: ["md"], // hide on mobile
      sorter: (a: any, b: any) => a.OrderItems.localeCompare(b.OrderItems),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Ready", value: "Ready" },
        { text: "InProgress", value: "InProgress" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"], // hide on mobile
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (createdAt: string) => formatAsLocal12Hr(createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedOrder(record);
            setIsDetailDialogOpen(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order History
          </h1>
        </div>
      </div>
      <Card className="overflow-hidden">
        <Table
          rowKey="id"
          size="small"
          pagination={{ pageSize: 15 }}
          dataSource={orders}
          columns={ordersColumns}
          scroll={{ x: 800 }}
        />
      </Card>
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {selectedOrder.OrderId}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
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
                  <p className="text-xs sm:text-sm text-gray-500">Employee</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {selectedOrder.employee_name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedOrder.employee_code}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Date & Time
                  </p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatAsLocal12Hr(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Order Items
                </p>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {item.menuName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Quantity: {item.Quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900 text-sm sm:text-base text-right">
                        ₹{(item.price * item.Quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    Total Amount
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹{selectedOrder.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderHistory;
