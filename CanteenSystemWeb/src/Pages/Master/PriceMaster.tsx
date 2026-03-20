import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import API from "../../API/API";
import {
  createPriceMaster,
  getAllItems,
  getAllPrice,
} from "../../API/endpoints";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const { Option } = Select;

interface Price {
  key: string;
  priceId: string;

  itemName: string;
  category: string;
  price: number;
  period: string;
}
interface Item {
  key: string;
  id: string;
  itemName: string;
  category: string;
}

const PriceMaster = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [prices, setPrices] = useState<Price[]>([]);
  const [itemOptions, setItemOptions] = useState<Item[]>([]);

  useEffect(() => {
    fetchAllPrices();
    fetchAllItems();
  }, []);
  const fetchAllPrices = async () => {
    try {
      const response = await API.get(getAllPrice);

      if (response.status === 200) {
        setPrices(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchAllItems = async () => {
    try {
      const response = await API.get(getAllItems);

      if (response.status === 200) {
        setItemOptions(response.data.data);
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
      title: "Price ID",
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
      filters: uniqueValues(prices, "itemName"),
      onFilter: (value: any, record: any) => record.itemName === value,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
      filters: uniqueValues(prices, "category"),
      onFilter: (value: any, record: any) => record.category === value,
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.price - b.price,
      render: (price: number) => `₹${price.toLocaleString("en-IN")}`,
    },
    {
      title: "Period",
      key: "period",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime(),
      render: (_: any, record: any) => (
        <>
          {dayjs(record.periodFrom).format("DD-MM-YYYY")}
          {" - "}
          {dayjs(record.periodTo).format("DD-MM-YYYY")}
        </>
      ),
    },
  ];

  const handleAddPrice = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      periodFrom: values.periodFrom.format("YYYY-MM-DD"),
      periodTo: values.periodTo.format("YYYY-MM-DD"),
    };
    console.log(payload);
    try {
      const response = await API.post(createPriceMaster, payload);
      if (response.status === 201) {
        toast.success("Price Created");
        form.resetFields();
        fetchAllPrices();
        setOpen(false);
        return;
      }
      toast.error("Error While Creating Price");
    } catch (error) {
      console.error("Error Data", error);
    }
    form.resetFields();
    fetchAllPrices();
    setOpen(false);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Price Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Price
        </Button>
      </div>

      {/* TABLE */}
      <Table
        size="small"
        columns={columns}
        dataSource={prices}
        bordered
        scroll={{ x: 500 }}
        pagination={{ pageSize: 10 }}
      />

      {/* ADD MODAL */}
      <Modal
        title="Add Price"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddPrice}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Item"
                name="itemId"
                rules={[{ required: true, message: "Select Item" }]}
              >
                <Select placeholder="Select Item">
                  {itemOptions.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.itemName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Price (₹)"
                name="price"
                rules={[{ required: true, message: "Enter price" }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Period From"
                name="periodFrom"
                rules={[{ required: true, message: "Select start date" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Period To"
                name="periodTo"
                rules={[{ required: true, message: "Select end date" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PriceMaster;
