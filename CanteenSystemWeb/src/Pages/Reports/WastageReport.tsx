import { Button, Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface WastageRecord {
  key: string;
  date: string;
  itemCode: string;
  itemName: string;
  type: "Wastage" | "Damage";
  quantity: number;
  unit: string;
  reason: string;
}

const WastageReport = () => {
  const data: WastageRecord[] = [
    {
      key: "1",
      date: "2026-01-01",
      itemCode: "I-101",
      itemName: "Rice",
      type: "Wastage",
      quantity: 3,
      unit: "Kg",
      reason: "Expired stock",
    },
    {
      key: "2",
      date: "2026-01-02",
      itemCode: "I-103",
      itemName: "Sandwich",
      type: "Damage",
      quantity: 5,
      unit: "Nos",
      reason: "Packaging damaged",
    },
    {
      key: "3",
      date: "2026-01-02",
      itemCode: "I-102",
      itemName: "Wheat",
      type: "Wastage",
      quantity: 2,
      unit: "Kg",
      reason: "Spillage",
    },
  ];

  const columns = [
    { title: "Date", dataIndex: "date" },
    { title: "Item Code", dataIndex: "itemCode" },
    { title: "Item Name", dataIndex: "itemName" },
    { title: "Type", dataIndex: "type" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Reason", dataIndex: "reason" },
  ];

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Item Code",
      "Item Name",
      "Type",
      "Quantity",
      "Unit",
      "Reason",
    ];

    const rows = data.map((row) =>
      [
        row.date,
        row.itemCode,
        row.itemName,
        row.type,
        row.quantity,
        row.unit,
        row.reason,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "wastage_report.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Wastage & Damage Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View wastage and damage records.
          </p>
        </div>

        <Button
          icon={<DownloadOutlined />}
          type="primary"
          onClick={exportToCSV}
        >
          Export
        </Button>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default WastageReport;
