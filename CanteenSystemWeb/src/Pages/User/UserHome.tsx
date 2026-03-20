import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Minus,
  Plus,
  QrCode,
  CheckCircle,
  XCircle,
  ArrowLeft,
  History,
  Clock,
} from "lucide-react";

import type { MenuItem, Employee, OrderItem } from "../../types";
import API from "../../API/API";
import { getAllMenu, getUserWallet, placeOrder } from "../../API/endpoints";
import toast from "react-hot-toast";

type POSScreen =
  | "login"
  | "menu"
  | "qr-scan"
  | "payment-confirm"
  | "success"
  | "error"
  | "order-history";

export default function UserHome() {
  const userid = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [currentScreen, setCurrentScreen] = useState<POSScreen>("login");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [scannedEmployee, setScannedEmployee] = useState<Employee | null>(null);
  const [orderId, setOrderId] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userWallet, setUserWallet] = useState({
    id: 0,
    balance: 0,
    name: "",
    empCode: "",
    cap_amount: 0,
  });
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);
  console.log("cart:", cart);
  const fetchUserWalletDetails = async (userId: number) => {
    try {
      const payload = {
        empId: userId,
      };
      const response = await API.post(getUserWallet, payload);
      if (response.status === 200) {
        setUserWallet(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  console.log("User Wallet:", userWallet);
  const fetchMenuItems = async () => {
    try {
      const response = await API.get(getAllMenu);
      if (response.status === 200) {
        const data = response.data.data.filter((item) => item.amount !== 0);

        setMenuItems(data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          menuItemId: menuItem.id,
          menuName: menuItem.menuName,
          quantity: 1,
          price: menuItem.price,
          remark: "",
        },
      ]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      );
    } else {
      setCart(cart.filter((item) => item.menuItemId !== menuItemId));
    }
  };

  const handleLogin = () => {
    setCurrentScreen("menu");
  };

  const handleProceedToPay = () => {
    fetchUserWalletDetails(parseInt(userid || "0"));
    setCurrentScreen("payment-confirm");
  };
  const orderRefId = "ORD" + new Date().getTime();

  const handleConfirmPayment = async () => {
    setLoading(true);
    const walletBalance = userWallet?.balance ?? 0;
    const capBalance = userWallet?.cap_amount ?? 0;

    // Calculate deductions
    const walletDeduction = Math.min(walletBalance, totalAmount);
    const capDeduction =
      walletBalance < totalAmount ? totalAmount - walletBalance : 0;

    // Final safety check (UI already checks, but never trust UI)
    if (walletDeduction + capDeduction !== totalAmount) {
      toast.error("Insufficient balance");
      return;
    }

    const payload = {
      walletId: userWallet.id,
      cart: cart,
      empId: parseInt(userid || "0"),
      orderAmnt: totalAmount,
      orderRefId: orderRefId,
      walletDeduction,
      capDeduction,
    };
    console.log("pay", payload);
    try {
      const response = await API.post(placeOrder, payload);

      if (response.data.success) {
        toast.success("Order placed successfully");
        setCurrentScreen("success");
      } else {
        toast.error(response.data.message);
        setCurrentScreen("error");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Insufficient inventory");
    } finally {
      setLoading(false);
    }
  };

  // Payment Confirmation Screen
  if (currentScreen === "payment-confirm") {
    // ---- DERIVED UI VALUES ----
    const walletBalance = userWallet?.balance ?? 0;
    const capBalance = parseInt(userWallet?.cap_amount) ?? 0;

    const walletUsed = Math.min(walletBalance, totalAmount);
    const capUsed =
      walletBalance < totalAmount ? totalAmount - walletBalance : 0;

    const hasSufficientBalance =
      walletBalance >= totalAmount || walletBalance + capBalance >= totalAmount;

    // ---- UI ----
    return (
      <div className="bg-gray-100 flex justify-center p-1">
        <Card className="w-full max-w-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Confirm Payment
          </h2>

          <div className="space-y-6">
            {/* EMPLOYEE */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Employee</p>
              <p className="text-xl font-semibold text-gray-900">
                {userWallet?.name}
              </p>
              <p className="text-sm text-gray-600">{userWallet?.empCode}</p>
            </div>

            {/* BALANCES */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{walletBalance.toFixed(2)}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  walletBalance < totalAmount
                    ? "bg-yellow-50 border border-yellow-300"
                    : "bg-gray-50"
                }`}
              >
                <p className="text-sm text-gray-500">Cap Balance</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{capBalance.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Bill Amount</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* PAYMENT BREAKDOWN */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Payment Breakdown
              </p>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wallet</span>
                <span className="font-semibold text-gray-900">
                  ₹{walletUsed.toFixed(2)}
                </span>
              </div>

              {capUsed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cap Balance</span>
                  <span className="font-semibold text-gray-900">
                    ₹{capUsed.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* INSUFFICIENT TOTAL BALANCE (highest priority) */}
            {!hasSufficientBalance && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-700">
                  Insufficient Balance
                </p>
                <p className="text-sm text-red-600">
                  Wallet + Cap balance is not enough to complete this payment.
                </p>
              </div>
            )}

            {/* WALLET INSUFFICIENT BUT CAP WILL BE USED */}
            {hasSufficientBalance && capUsed > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Wallet balance is insufficient. Remaining amount will be
                  deducted from Cap Balance.
                </p>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => setCurrentScreen("menu")}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 h-12"
                style={{
                  backgroundColor: hasSufficientBalance ? "#16A34A" : "#9CA3AF",
                }}
                disabled={!hasSufficientBalance || loading}
                onClick={handleConfirmPayment}
              >
                {capUsed > 0 ? "Confirm (Using Cap)" : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Success Screen
  if (currentScreen === "success") {
    return (
      <div className="h-120  flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          {/* Icon */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-12 h-12 sm:w-18 sm:h-18 text-green-600" />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">
            Payment Successful!
          </h2>

          {/* Order ID */}
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Order ID: {orderRefId}
          </p>

          {/* Action */}
          <button
            className="mt-2 sm:mt-2 text-sm text-green-700 font-medium underline underline-offset-4  cursor-pointer"
            onClick={() => {
              setCurrentScreen("menu");
              setCart([]);
            }}
          >
            Return to menu
          </button>
        </div>
      </div>
    );
  }

  // Error Screen
  if (currentScreen === "error") {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-20 h-20" style={{ color: "#DC2626" }} />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-4">Insufficient wallet balance</p>
          <p className="text-sm text-gray-500 mt-8">
            Redirecting in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Order History Screen
  if (currentScreen === "order-history") {
    // Get today's orders
    const todayOrders = mockOrders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setCurrentScreen("menu")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Order History - Today
              </h1>
            </div>
            <Button variant="outline" onClick={() => setCurrentScreen("login")}>
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <p className="text-sm text-gray-500">Total Orders Today</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {todayOrders.length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500">Successful Orders</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {todayOrders.filter((o) => o.status === "success").length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                ₹
                {todayOrders
                  .filter((o) => o.status === "success")
                  .reduce((sum, o) => sum + o.totalAmount, 0)
                  .toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Orders List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Orders
            </h2>
            <div className="space-y-3">
              {todayOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No orders found for today</p>
                </div>
              ) : (
                todayOrders.map((order) => (
                  <Card key={order.id} className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {order.orderId}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === "success"
                                ? "bg-green-100 text-green-700"
                                : order.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.employeeName} ({order.employeeId})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.timestamp).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-gray-900 font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category)),
  );
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = activeTab === "ALL" || item.category === activeTab;

    const matchesSearch = item.menuName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });
  const handleRemarkChange = (menuItemId, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId ? { ...item, remark: value } : item,
      ),
    );
  };

  // Menu Selection Screen (Main POS)
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 pt-2 max-w-screen mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "ALL"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All Items
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      activeTab === category
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredMenuItems.map((item) => {
                const cartItem = cart.find((c) => c.menuItemId === item.id);

                const quantity = cartItem?.quantity || 0;

                return (
                  <Card
                    key={item.id}
                    className="p-3 hover:shadow-md transition-all"
                  >
                    {/* Image */}
                    <div className="h-32 w-full mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={`${item.url}`}
                        alt={item.menuName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/menuAlt.png";
                        }}
                      />
                    </div>

                    {/* Title + Category */}
                    <div className="mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                        {item.menuName}
                      </h3>

                      <p className="text-xs text-gray-500">{item.category}</p>

                      {item.category !== "Finished Goods" && (
                        <p
                          className={`text-xs font-medium ${
                            item.amount > 5 ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {item.amount > 0
                            ? `Stock Left: ${item.amount}`
                            : "Out of Stock"}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <p className="text-2xl font-semibold text-gray-900 mb-2">
                      ₹{item.price}
                    </p>

                    {/* Actions */}
                    {item.amount === 0 ? (
                      <Button
                        size="sm"
                        disabled
                        className="w-full h-8 text-xs bg-gray-300 text-gray-600 cursor-not-allowed"
                      >
                        Out of Stock
                      </Button>
                    ) : quantity > 0 ? (
                      <div className="flex items-center justify-between gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="min-w-[28px] text-center font-semibold text-sm">
                          {quantity}
                        </span>

                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="w-3 h-3 mr-1 text-white" />
                        Add
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current Order
              </h2>
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No items added
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.menuName}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                className="w-full h-12 text-base"
                style={{
                  backgroundColor: cart.length > 0 ? "#2563EB" : "#9CA3AF",
                }}
                disabled={cart.length === 0}
                onClick={handleProceedToPay}
              >
                Proceed to Pay
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
