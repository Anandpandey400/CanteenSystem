import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import API from "../../API/API";
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
} from "../../API/endpoints";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

interface Employee {
  key: string;
  id: string | number;
  employee_code: string;
  employee_name: string;
  email: string;
  cap_amount: Number;
  MobileNumber: Number;
  UserName: string;
}

const EmployeeMaster = () => {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    id: 0,
    employee_code: "",
    employee_name: "",
    email: "",
    cap_amount: 0,
  });
  const [editModal, setEditModal] = useState<Boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    try {
      const response = await API.get(getAllEmployees);

      if (response.status === 200) {
        setEmployees(response.data.data);
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      key: "employee_code",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_code.localeCompare(b.employee_code),
      filters: uniqueValues(employees, "employee_code"),
      onFilter: (value: any, record: any) => record.employee_code === value,
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) =>
        a.employee_name.localeCompare(b.employee_name),
      filters: uniqueValues(employees, "employee_name"),
      onFilter: (value: any, record: any) => record.employee_name === value,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
      filters: uniqueValues(employees, "email"),
      onFilter: (value: any, record: any) => record.email === value,
    },
    {
      title: "Cap Amount",
      dataIndex: "cap_amount",
      key: "cap_amount",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a: any, b: any) => a.cap_amount - b.cap_amount,
      render: (cap_amount: number) => `₹${cap_amount.toLocaleString("en-IN")}`,
    },
    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Edit User">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRow(record);
                form.setFieldsValue({
                  EmployeeCode: record.employee_code,
                  EmployeeName: record.employee_name,
                  Email: record.email,
                  CapAmount: record.cap_amount,
                  userName: record.UserName,
                  mobile: record.MobileNumber,
                });
                setEditModal(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddEmployee = async () => {
    try {
      const values = await form.validateFields();

      const newEmployee: Employee = {
        key: Date.now().toString(),
        ...values,
      };
      console.log("newEmployee", newEmployee);

      const response = await API.post(createEmployee, newEmployee);

      if (response.status === 201) {
        toast.success("Employee Created");
        form.resetFields();
        fetchAllEmployees();
        setOpen(false);
        return;
      }
      toast.error("Error While Creating Employee");
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const handleEditEmployee = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        empId: selectedRow.id,
        Email: values.Email,
        mobile: values.mobile,
        CapAmount: values.CapAmount,
        userName: values.userName,
      };
      const response = await API.post(updateEmployee, payload);
      if (response.status === 200) {
        fetchAllEmployees();
        setEditModal(false);
        toast.success("Employee Edited Sucessfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;

    const q = searchQuery.toLowerCase();

    return employees.filter(
      (emp) =>
        emp.employee_name?.toLowerCase().includes(q) ||
        emp.employee_code?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        String(emp.MobileNumber ?? "").includes(q),
    );
  }, [employees, searchQuery]);

  return (
    <div>
      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">
        {/* LEFT */}
        <h2 className="text-lg font-semibold">Employee Master</h2>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-72">
            <Input
              placeholder="Search by name or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
          pl-10
          bg-white
          border border-gray-200
          rounded-lg
          shadow-sm
          text-gray-800
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
          duration-200
        "
            />
          </div>

          {/* Add button */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        size="small"
        columns={columns}
        dataSource={filteredEmployees}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      {/* ADD MODAL */}
      <Modal
        title="Add Employee"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddEmployee}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee Code"
                name="EmployeeCode"
                rules={[{ required: true, message: "Employee Code required" }]}
              >
                <Input placeholder="E-101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Employee Name"
                name="EmployeeName"
                rules={[{ required: true, message: "Employee Name required" }]}
              >
                <Input placeholder="Employee Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username" name="userName">
                <Input placeholder="Username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mobile Number" name="mobile">
                <InputNumber
                  placeholder="000000000"
                  style={{ width: "100%" }}
                  min={10}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name="Email">
                <Input placeholder="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Cap Amount"
                name="CapAmount"
                rules={[{ required: true, message: "Cap Amount required" }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* editModal */}
      <Modal
        title="Edit Employee"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleEditEmployee}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Employee Code" name="EmployeeCode">
                <Input placeholder="E-101" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employee Name" name="EmployeeName">
                <Input placeholder="Employee Name" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username" name="userName">
                <Input placeholder="Username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mobile Number" name="mobile">
                <InputNumber
                  placeholder="000000000"
                  style={{ width: "100%" }}
                  min={10}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name="Email">
                <Input placeholder="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cap Amount" name="CapAmount">
                <InputNumber
                  placeholder="0"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeMaster;
