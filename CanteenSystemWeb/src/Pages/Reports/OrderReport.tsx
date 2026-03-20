import { DownloadOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import API from "../../API/API";
import { getOrderReportData } from "../../API/endpoints";
import { useNavigate } from "react-router-dom";

type Props = {};
interface OrderReportData {
  Id: number;
  EmployeeName: string;
  UsedCapBalance: string;
  CapBalance: string;
  WalletBalance: number;
  totalOrders: number;
}

function OrderReport({}: Props) {
  const [data, setData] = useState<OrderReportData[]>([]);
  useEffect(() => {
    fetchOrderReport();
  }, []);
  const navigate = useNavigate();
  const fetchOrderReport = async () => {
    try {
      const response = await API.post(getOrderReportData);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const handleOrderDetails = (record: any) => {
    navigate(`/admin/order-details/${record.Id}`);
  };
  const columns = [
    { title: "ID", dataIndex: "Id" },
    { title: "Employee Name", dataIndex: "EmployeeName" },
    { title: "Used Cap Balance", dataIndex: "UsedCapBalance" },
    { title: "Cap Balance", dataIndex: "CapBalance" },
    { title: "Wallet Balance", dataIndex: "WalletBalance" },
    { title: "Total Orders", dataIndex: "totalOrders" },
    {
      title: "Oders Details",
      dataIndex: "details ",
      render: (_: any, record: any) => (
        <a onClick={() => handleOrderDetails(record)}>View Details</a>
      ),
    },
  ];
  return (
    <div className="space-y-4">
      {/* HEADER */}

      {/* TABLE */}
      <Table
        className="thin-table"
        columns={columns}
        dataSource={data}
        bordered
        pagination={{
          defaultPageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "20", "50", "100"],
        }}
      />
    </div>
  );
}

export default OrderReport;
