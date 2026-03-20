import { Button, Form, Input, Modal, Select, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createItem, getAllItems, getGenericMaster } from "../../API/endpoints";
import API from "../../API/API";
import toast from "react-hot-toast";

interface Item {
  key: string;
  id: string;
  itemName: string;
  category: string;
}
interface Category {
  id: number;
  masterTypeId: number;
  name: string;
}

const ItemMaster = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);

  useEffect(() => {
    fetchAllItems();
    fetchAllCategory();
  }, []);

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
  const fetchAllItems = async () => {
    try {
      const response = await API.get(getAllItems);

      if (response.status === 200) {
        setItems(response.data.data);
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
      title: "Item ID",
      dataIndex: "id",
      key: "id",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.itemName.localeCompare(b.itemName),
      filters: uniqueValues(items, "itemName"),
      onFilter: (value: any, record: any) => record.itemName === value,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
      filters: uniqueValues(items, "category"),
      onFilter: (value: any, record: any) => record.category === value,
    },
  ];

  const handleAddItem = async () => {
    const values = await form.validateFields();

    const newItem: Item = {
      key: Date.now().toString(),
      ...values,
    };

    try {
      const response = await API.post(createItem, newItem);
      if (response.status === 201) {
        toast.success("Item Created");
        setItems([...items, newItem]);
        form.resetFields();
        fetchAllItems();
        setOpen(false);
        return;
      }
      toast.error("Erro While Creating Item");
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Item Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Item
        </Button>
      </div>

      {/* TABLE */}
      <Table
        size="small"
        columns={columns}
        dataSource={items}
        bordered
        scroll={{ x: 400 }}
        pagination={{ pageSize: 10 }}
      />

      {/* ADD MODAL */}
      <Modal
        title="Add Item"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddItem}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Item Name"
            name="itemName"
            rules={[{ required: true, message: "Item Name is required" }]}
          >
            <Input placeholder="Item Name" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select>
              {allCategory
                .filter((cat) => cat.id !== 2)
                .map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemMaster;
