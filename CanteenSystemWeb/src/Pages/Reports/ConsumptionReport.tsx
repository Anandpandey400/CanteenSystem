import { Button, Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import API from "../../API/API";
import { getConsumptionReport } from "../../API/endpoints";

interface Consumption {
  key: string;
  date: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
}

const ConsumptionReport = () => {
  const [data, setData] = useState<Consumption[]>([]);
  useEffect(() => {
    fetchConsumptionData();
  }, []);
  const fetchConsumptionData = async () => {
    try {
      const response = await API.post(getConsumptionReport);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const columns = [
    { title: "Item Name", dataIndex: "itemName" },
    { title: "Category", dataIndex: "category" },
    { title: "Quantity", dataIndex: "consumption" },
    { title: "Unit", dataIndex: "unit" },
  ];

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Item Code",
      "Item Name",
      "Category",
      "Quantity",
      "Unit",
    ];

    const rows = data.map((row) =>
      [
        row.date,
        row.itemCode,
        row.itemName,
        row.category,
        row.quantity,
        row.unit,
      ].join(","),
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "consumption_report.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

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
          defaultPageSize: 12,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "20", "50", "100"],
        }}
      />
    </div>
  );
};

export default ConsumptionReport;
