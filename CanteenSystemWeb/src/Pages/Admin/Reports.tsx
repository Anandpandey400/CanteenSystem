import { Button, Tabs } from "antd";
import Consumption from "../Reports/ConsumptionReport";
import WastageReport from "../Reports/WastageReport";
import OrderReport from "../Reports/OrderReport";
import { DownloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import API from "../../API/API";
import { getConsumptionReport, getOrderReportData } from "../../API/endpoints";

type Props = {};

const Reports = (props: Props) => {
  const [activeTab, setActiveTab] = useState("Order Reports");
  const downloadOrderReport = async () => {
    try {
      const response = await API.post(getOrderReportData);

      if (response.status === 200) {
        const data = response.data.data;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Order Report");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const file = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });

        saveAs(file, "OrderReport.xlsx");
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const downloadConsumptionReport = async () => {
    try {
      const response = await API.post(getConsumptionReport);

      if (response.status === 200) {
        const data = response.data.data;

        if (!data || data.length === 0) {
          console.log("No data available for download");
          return;
        }

        // Convert JSON → Excel sheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Consumption Report");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const file = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });

        saveAs(file, "ConsumptionReport.xlsx");
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const handleDownloadExcel = () => {
    if (activeTab === "orderReports") {
      downloadOrderReport();
    } else if (activeTab === "consumption") {
      downloadConsumptionReport();
    }
  };
  return (
    <div>
      <div>
        {/* TAB HEADER */}
        <Tabs
          defaultActiveKey="vendor"
          type="line"
          onChange={(key) => setActiveTab(key)}
          tabBarExtraContent={
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          }
          items={[
            {
              key: "orderReports",
              label: "Order Report",
              children: <OrderReport />,
            },
            {
              key: "consumption",
              label: "Consumption Report",
              children: <Consumption />,
            },

            // {
            //   key: "item",
            //   label: "Item Master",
            //   children: <ItemMaster />,
            // },
            // {
            //   key: "price",
            //   label: "Price Master",
            //   children: <PriceMaster />,
            // },
          ]}
        />
      </div>
    </div>
  );
};

export default Reports;
