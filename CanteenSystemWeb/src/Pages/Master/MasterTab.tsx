import React from "react";
import { Tabs } from "antd";
import VendorMaster from "./VendorMaster";
import ItemMaster from "./ItemMaster";
import EmployeeMaster from "./EmployeeMaster";
import PriceMaster from "./PriceMaster";

type Props = {};

const MasterTab: React.FC<Props> = () => {
  return (
    <div>
      {/* TAB HEADER */}
      <Tabs
        defaultActiveKey="vendor"
        type="line"
        items={[
          {
            key: "vendor",
            label: "Vendor Master",
            children: <VendorMaster />,
          },
          {
            key: "employee",
            label: "Employee Master",
            children: <EmployeeMaster />,
          },

          {
            key: "item",
            label: "Item Master",
            children: <ItemMaster />,
          },
          {
            key: "price",
            label: "Price Master",
            children: <PriceMaster />,
          },
        ]}
      />
    </div>
  );
};

export default MasterTab;
