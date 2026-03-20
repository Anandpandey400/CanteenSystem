// Core Types for Cashless Canteen System

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  balance: number;
  status: 'active' | 'inactive';
  lastRecharge: string;
  qrCode: string;
  employee_code : string
  employee_name : string

}

export interface InventoryItem {
  id: string;
  itemId: number
  name: string;
  itemName: string
  type: 'raw' | 'finished';
  unit: string;
  availableStock: number;
  reorderLevel: number;
  lastUpdated: string;
  vendor?: string;
  vendor_Name ? : string
  amount : number
  category: string | number
}

export interface MenuItem {
  id: string;
  menuName: string;
  category: string;
  price: number;
  status: number;
  image?: string;
  amount ?: number
  ingredients: MenuIngredient[];
  url : string;
}

export interface MenuIngredient {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: number;
}

export interface Order {
  id: string;
  orderId: string;
  employeeId: string;
  employeeName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Completed' | 'Cancelled' | 'pending' | 'InProgress' | 'Ready' | 'success' | 'failed' | 'FOC';
  timestamp: string;
  vendorId: string;
  Quantity: number;
  menuName : string;
  price : number;
  amount : number;
  employee_code : string;
  employee_name : string;
  createdAt : string;
  OrderId : string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  menuName : string;
   remark?: string;
}

export interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
  orderId?: string;
}

export interface Vendor {
  id: string;
  vendorId: string;
  vendor_name : string;
  name: string;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  activeWallets: number;
  lowStockItems: number;
}
