import { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { Plus, Search } from "lucide-react";
import type { InventoryItem, Vendor } from "../../types/index";
import {
  DeleteOutlined,
  FileTextOutlined,
  InboxOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  createInventory,
  getAllInventory,
  getAllVendors,
  getGenericMaster,
  getInventoryLogs,
  getItemData,
  StockIn,
  wastage,
} from "../../API/endpoints";
import API from "../../API/API";
import toast from "react-hot-toast";
import dayjs from "dayjs";

interface Category {
  id: number;
  masterTypeId: number;
  name: string;
}
interface Item {
  id: number;
  itemName: string;
  name: string;
}
interface Unit {
  id: number;
  itemName: string;
  name: string;
}
interface InventoryLogs {
  itemName: string;
  actionType: string;
  previousAmount: number;
  changeAmount: number;
  newAmount: number;
  reason: string;
}

export default function Inventory() {
  const [form] = Form.useForm();
  const [selectedItemPrice, setSelectedItemPrice] = useState<number>(0);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStockInDialogOpen, setIsStockInDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [itemData, setItemData] = useState<Item[]>([]);
  const [stockQty, setStockQty] = useState<number>(0);
  const [invtLogs, setInvtLogs] = useState<InventoryLogs[]>([]);
  const [logsModal, setLogsModal] = useState(false);
  const [wastageModal, setWastageModal] = useState(false);
  const [type, setType] = useState("");
  const [wastageReason, setWastageReason] = useState("");
  useEffect(() => {
    fetchAllInventory();
    fetchAllCategory();
    fetchAllUnits();
    fetchAllvendors();
  }, []);
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();

    return (
      item.itemName?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.unit?.toLowerCase().includes(q) ||
      item.vendor_Name?.toLowerCase().includes(q)
    );
  });

  const fetchAllCategory = async () => {
    try {
      const payload = {
        masterTypeId: 4,
      };
      const response = await API.post(getGenericMaster, payload);

      if (response.status === 201) {
        setAllCategory(response.data.result);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchAllvendors = async () => {
    try {
      const response = await API.get(getAllVendors);

      if (response.status === 200) {
        setVendors(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchAllInventory = async () => {
    try {
      const response = await API.get(getAllInventory);

      if (response.status === 200) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const fetchAllUnits = async () => {
    try {
      const payload = {
        masterTypeId: 6,
      };
      const response = await API.post(getGenericMaster, payload);
      console.log("resd", response);
      if (response.status === 201) {
        setUnits(response.data.result);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const fetchTypeWiseData = async (id: number) => {
    try {
      const payload = {
        category: id,
      };
      const response = await API.post(getItemData, payload);
      if (response.status === 200) {
        setItemData(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const handleTypeChange = (value: number) => {
    if (!value) {
      toast.error("Please Select a Type");
      return;
    }

    const newType = value === 1 ? "RAWMAT" : "TRD";
    setType(newType);

    // reset dependent fields when type changes
    setSelectedItemPrice(0);
    form.setFieldsValue({
      item: undefined,
      amount: undefined,
      price: undefined,
    });

    fetchTypeWiseData(value);
  };

  const handleAddInventory = async (values: any) => {
    const payload = {
      itemId: values.item,
      unitId: values.unit,
      price: values.price,
      amount: parseInt(values.amount),
      reorderLvl: parseInt(values.reorderLevel),
      vendorId: values.vendor,
    };

    try {
      const response = await API.post(createInventory, payload);
      if (response.status === 201) {
        form.resetFields();
        fetchAllInventory();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const handleStockIn = async (inventoryId: number, quantity: number) => {
    const payload = {
      inventoryId,
      itemId: selectedItem.itemId,
      changeQty: quantity,
    };
    try {
      const response = await API.post(StockIn, payload);
      if (response.status === 201) {
        setStockQty(0);
        setSelectedItem(null);
        fetchAllInventory();
        setIsStockInDialogOpen(false);
        toast.success("Stock In Sucessful");
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const handleLogs = async (data: InventoryItem) => {
    setSelectedItem(data);
    setLogsModal(true);

    try {
      const payload = {
        inventoryId: data.id,
      };
      const response = await API.post(getInventoryLogs, payload);
      if (response.status === 200) {
        setInvtLogs(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const handlWastage = async (data: InventoryItem) => {
    setSelectedItem(data);
    setWastageModal(true);
  };
  const handleWasatges = async (inventoryId: number, quantity: number) => {
    if (quantity <= 0) {
      toast.error("Please Select Some Value");
      return;
    }
    if (!wastageReason) {
      toast.error("Please Add A Reason");
      return;
    }
    const payload = {
      inventoryId,
      itemId: selectedItem.itemId,
      changeQty: quantity,
      reason: wastageReason,
    };
    try {
      const response = await API.post(wastage, payload);
      if (response.status === 201) {
        setWastageReason("");
        setStockQty(0);
        setSelectedItem(null);
        fetchAllInventory();
        setWastageModal(false);
        toast.success("Wastage Added Sucessfully");
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const uniqueValues = (data: any[], key: string) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).map(
      (val) => ({
        text: val,
        value: val,
      }),
    );

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.itemName.localeCompare(b.itemName),
      filters: uniqueValues(filteredItems, "itemName"),
      onFilter: (value: any, record: any) => record.itemName === value,
      render: (_: any, record: any) => (
        <Space>
          {record.amount <= record.reorderLvl && (
            <WarningOutlined style={{ color: "#DC2626" }} />
          )}
          <span>{record.itemName}</span>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "category",
      key: "type",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
      filters: uniqueValues(filteredItems, "category"),
      onFilter: (value: any, record: any) => record.category === value,
      render: (category: string) => (
        <Tag color={category === "Raw Material" ? "blue" : "green"}>
          {category.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.unit.localeCompare(b.unit),
      filters: uniqueValues(filteredItems, "unit"),
      onFilter: (value: any, record: any) => record.unit === value,
    },
    {
      title: "Available Stock",
      dataIndex: "amount",
      key: "availableStock",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (value: number, record: any) => (
        <span
          style={{
            color: record.amount <= record.reorderLvl ? "#DC2626" : "inherit",
            fontWeight: 500,
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Consumption",
      dataIndex: "consumption",
      key: "consumption",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => (a.consumption ?? 0) - (b.consumption ?? 0),
      render: (value: number, record: any) => {
        const consumption = value ?? 0;
        const isHighConsumption = consumption >= record.reorderLvl;

        return (
          <span
            title={
              isHighConsumption
                ? `High consumption! Reorder level: ${record.reorderLvl}`
                : "Consumption within safe limits"
            }
            style={{
              color: isHighConsumption ? "#DC2626" : "#374151",
              fontWeight: 600,
            }}
          >
            {consumption}
            {isHighConsumption && " 🔥"}
          </span>
        );
      },
    },

    {
      title: "Reorder Level",
      dataIndex: "reorderLvl",
      key: "reorderLevel",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.reorderLvl - b.reorderLvl,
    },
    {
      title: "Vendor",
      dataIndex: "vendor_Name",
      key: "vendor",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        (a.vendor_Name || "").localeCompare(b.vendor_Name || ""),
      filters: uniqueValues(filteredItems, "vendor_Name"),
      onFilter: (value: any, record: any) => record.vendor_Name === value,
      render: (v: string) => v || "-",
    },
    {
      title: "Date",
      key: "Date",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_: any, record: any) => (
        <>{dayjs(record.createdAt).format("DD-MM-YYYY")}</>
      ),
    },
    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Stock In">
            <Button
              size="small"
              icon={<InboxOutlined />}
              onClick={() => {
                setSelectedItem(record);
                setIsStockInDialogOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Wastage">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handlWastage(record)}
            />
          </Tooltip>

          <Tooltip title="Logs">
            <Button
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleLogs(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const uniqueValuesLog = (data: any[], key: string) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).map(
      (val) => ({
        text: val,
        value: val,
      }),
    );

  const logColumn = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.itemName.localeCompare(b.itemName),
      filters: uniqueValuesLog(invtLogs, "itemName"),
      onFilter: (value: any, record: any) => record.itemName === value,
    },
    {
      title: "Action Type",
      dataIndex: "actionType",
      key: "actionType",
      responsive: ["xs", "sm", "md", "lg"],
      filters: [
        { text: "STOCK IN", value: "STOCK_IN" },
        { text: "WASTAGE", value: "WASTAGE" },
      ],
      onFilter: (value: any, record: any) => record.actionType === value,
      sorter: (a: any, b: any) => a.actionType.localeCompare(b.actionType),
      render: (actionType: string) => (
        <Tag
          color={
            actionType === "STOCK_IN" || actionType === "CREDIT"
              ? "green"
              : "red"
          }
        >
          {actionType.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        (a.reason || "").localeCompare(b.reason || ""),
      filters: uniqueValuesLog(invtLogs, "reason"),
      onFilter: (value: any, record: any) => record.reason === value,
      render: (reason: string) => (reason ? reason : "-"),
    },
    {
      title: "Previous Quantity",
      dataIndex: "previousAmount",
      key: "previousAmount",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.previousAmount - b.previousAmount,
    },
    {
      title: "Changed Quantity",
      dataIndex: "changeAmount",
      key: "changeAmount",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.changeAmount - b.changeAmount,
    },
    {
      title: "New Quantity",
      dataIndex: "newAmount",
      key: "newAmount",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.newAmount - b.newAmount,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (_: any, record: any) => (
        <>{dayjs(record.createdAt).format("DD-MM-YYYY")}</>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage raw materials and stock levels
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#2563EB", color: "#fff" }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>

            <Form
              layout="vertical"
              form={form}
              onFinish={(values) => handleAddInventory(values)}
            >
              {/* Type + Item */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  label="Type"
                  name="typeId"
                  rules={[{ required: true, message: "Select type" }]}
                >
                  <Select
                    placeholder="Select type"
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={allCategory
                      .filter((cat) => cat.id !== 2)
                      .map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                      }))}
                    onChange={handleTypeChange}
                  />
                </Form.Item>

                <Form.Item
                  label="Item"
                  name="item"
                  rules={[{ required: true, message: "Select Item" }]}
                >
                  <Select
                    placeholder="Select Item"
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={itemData.map((item) => ({
                      label: item.itemName,
                      value: item.id,
                    }))}
                    onChange={(itemId) => {
                      const selectedItem = itemData.find(
                        (item) => item.id === itemId,
                      );

                      const itemPrice = Number(selectedItem?.price) || 0;
                      const amount = Number(form.getFieldValue("amount")) || 0;

                      setSelectedItemPrice(itemPrice);

                      if (type === "TRD") {
                        form.setFieldsValue({
                          price: itemPrice * amount,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </div>

              {/* Unit + Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  label="Unit"
                  name="unit"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Unit"
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={units.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Quantity"
                  name="amount"
                  rules={[{ required: true }]}
                >
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      const amount = Number(e.target.value) || 0;

                      if (type === "TRD") {
                        form.setFieldsValue({
                          price: selectedItemPrice * amount,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </div>

              {/* Price + Reorder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  label="Amount"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <Input
                    type="number"
                    placeholder="0"
                    disabled={type === "TRD"}
                  />
                </Form.Item>

                <Form.Item
                  label="Reorder Level"
                  name="reorderLevel"
                  rules={[{ required: true }]}
                >
                  <Input type="number" placeholder="0" />
                </Form.Item>
              </div>

              {/* Vendor */}
              <Form.Item label="Vendor Name" name="vendor">
                <Select
                  placeholder="Select Vendor"
                  getPopupContainer={(trigger) => trigger.parentElement!}
                  options={vendors.map((cat) => ({
                    label: cat.vendor_name,
                    value: cat.id,
                  }))}
                />
              </Form.Item>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full sm:flex-1"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full sm:flex-1"
                >
                  Save Item
                </Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Search */}
      <Card
        bordered
        styles={{
          body: {
            padding: 8,
          },
        }}
        style={{ borderRadius: 5, marginBottom: 12 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            size="small"
          />
        </div>
      </Card>
      {/* Items Table */}
      <Card bordered bodyStyle={{ padding: 0 }} style={{ borderRadius: 12 }}>
        <Table
          size="small"
          columns={columns}
          dataSource={filteredItems}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 8 }}
          rowClassName={(record) =>
            record.amount <= record.reorderLvl ? "bg-red-100" : ""
          }
        />
      </Card>
      {/* //sstock in */}
      <Modal
        title={`Stock In - ${selectedItem?.itemName || ""}`}
        open={isStockInDialogOpen}
        onCancel={() => {
          setIsStockInDialogOpen(false);
          setStockQty(0);
          setSelectedItem(null);
        }}
        onOk={() => {
          if (selectedItem && stockQty > 0) {
            handleStockIn(selectedItem.id, stockQty);
          }
        }}
        okText="Save"
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Current Stock */}
            <div>
              <label className="block text-sm mb-1">Current Stock</label>
              <Input
                value={`${selectedItem.amount} ${selectedItem.unit}`}
                disabled
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm mb-1">Quantity to Add</label>
              <InputNumber
                min={1}
                value={stockQty}
                onChange={(value) => setStockQty(value || 0)}
                style={{ width: "100%" }}
                placeholder="Enter quantity"
              />
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm mb-1">Vendor Name</label>
              <Input
                defaultValue={selectedItem.vendor_Name}
                placeholder="Supplier name"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm mb-1">Date</label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        )}
      </Modal>
      {/* //logs */}
      <Modal
        title={`Logs - ${selectedItem?.itemName || ""}`}
        open={logsModal}
        width={1400}
        onCancel={() => {
          setLogsModal(false);
          setStockQty(0);
          setWastageReason("");
          setSelectedItem(null);
        }}
        onOk={() => {}}
        okText="Save"
      >
        <Table
          className="thin-table"
          size="small"
          columns={logColumn}
          dataSource={invtLogs}
          rowKey="id"
          scroll={{ x: 400 }}
          pagination={{ pageSize: 10 }}
        />
      </Modal>
      {/* //waastage */}
      <Modal
        title={`Wastage - ${selectedItem?.itemName || ""}`}
        open={wastageModal}
        width={500}
        height={500}
        onCancel={() => {
          setWastageModal(false);
          setSelectedItem(null);
        }}
        onOk={() => {
          handleWasatges(selectedItem.id, stockQty);
        }}
        okText="Save"
      >
        {selectedItem && (
          <div className="space-y-5">
            {/* Current Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock
              </label>
              <Input
                value={`${selectedItem.amount} ${selectedItem.unit}`}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wastage Reason
              </label>
              <Input
                className="bg-gray-100"
                placeholder="Enter reason for wastage"
                value={wastageReason}
                onChange={(e) => setWastageReason(e.target.value)}
                required
              />
            </div>
            {/* Wastage Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wastage Quantity
              </label>
              <InputNumber
                min={1}
                max={selectedItem.amount}
                value={stockQty}
                onChange={(value) => setStockQty(value ?? 0)}
                style={{ width: "100%" }}
                placeholder={`Enter wastage (${selectedItem.unit})`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max allowed: {selectedItem.amount} {selectedItem.unit}
              </p>
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name
              </label>
              <Input
                value={selectedItem.vendor_Name}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
