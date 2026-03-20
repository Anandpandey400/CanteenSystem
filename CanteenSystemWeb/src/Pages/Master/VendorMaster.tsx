import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createVendor, getAllVendors } from "../../API/endpoints";
import API from "../../API/API";
import toast from "react-hot-toast";

interface Vendor {
  key: string;
  id: string;
  vendor_code: string;
  vendor_name: string;
  email: string;
  mobileNumber: number;
}

const VendorMaster = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchAllVendors = async () => {
    try {
      const response = await API.get(getAllVendors);

      if (response.status === 200) {
        setVendors(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  useEffect(() => {
    fetchAllVendors();
  }, []);

  const uniqueValues = (data: any[], key: string) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).map(
      (val) => ({
        text: val,
        value: val,
      }),
    );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Vendor Code",
      dataIndex: "vendor_code",
      key: "vendor_code",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.vendor_code.localeCompare(b.vendor_code),
      filters: uniqueValues(vendors, "vendor_code"),
      onFilter: (value: any, record: any) => record.vendor_code === value,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.vendor_name.localeCompare(b.vendor_name),
      filters: uniqueValues(vendors, "vendor_name"),
      onFilter: (value: any, record: any) => record.vendor_name === value,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
      filters: uniqueValues(vendors, "email"),
      onFilter: (value: any, record: any) => record.email === value,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.mobileNumber.localeCompare(b.mobileNumber),
      filters: uniqueValues(vendors, "mobileNumber"),
      onFilter: (value: any, record: any) => record.mobileNumber === value,
    },
  ];

  const handleAddVendor = async () => {
    try {
      const values = await form.validateFields();
      const newVendor: Vendor = {
        key: Date.now().toString,
        ...values,
      };

      const response = await API.post(createVendor, newVendor);
      console.log(response, "response");
      if (response.status === 201) {
        toast.success("Vednor Created");
        form.resetFields();
        fetchAllVendors();
        setOpen(false);
        return;
      }
      toast.error("Error While Creating Vendor");
    } catch (error) {}
  };

  // form.resetFields();
  // setOpen(false);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Vendor Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Vendor
        </Button>
      </div>

      {/* TABLE */}
      <Table
        size="small"
        columns={columns}
        dataSource={vendors}
        bordered
        scroll={{ x: 800 }}
        pagination={{ pageSize: 10 }}
      />

      {/* ADD MODAL */}
      <Modal
        title="Add Vendor"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddVendor}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Vendor Code"
                name="VendorCode"
                rules={[{ required: true, message: "Vendor Code is required" }]}
              >
                <Input placeholder="V-101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vendor Name"
                name="VendorName"
                rules={[{ required: true, message: "Vendor Name is required" }]}
              >
                <Input placeholder="Vendor Name" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mobile Number" name="Mobile">
                <InputNumber
                  placeholder="0"
                  style={{ width: "100%" }}
                  min={10}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorMaster;
