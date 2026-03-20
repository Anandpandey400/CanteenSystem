import { OrderedListOutlined } from "@ant-design/icons";
import {
  ChartAreaIcon,
  ChartBar,
  Package,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tabs = [
  {
    label: "Master",
    path: "/master",
    roles: ["SuperAdmin"],
    icon: <Package className="w-4 h-4" />,
    activeIcon: <Package className="w-4 h-4 text-blue-600" />,
  },
  {
    label: "Inventory",
    path: "/admin/inventory",
    roles: ["SuperAdmin", "Admin"],
    icon: <Package className="w-4 h-4" />,
    activeIcon: <Package className="w-4 h-4 text-blue-600" />,
  },
  {
    label: "Menu & Recipe",
    path: "/admin/menu",
    roles: ["SuperAdmin", "Admin"],
    icon: <UtensilsCrossed className="w-4 h-4" />,
    activeIcon: <UtensilsCrossed className="w-4 h-4 text-blue-600" />,
  },
  {
    label: "Wallets",
    path: "/admin/wallets",
    roles: ["SuperAdmin", "Admin"],
    icon: <Wallet className="w-4 h-4" />,
    activeIcon: <Wallet className="w-4 h-4 text-blue-600" />,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    roles: ["SuperAdmin", "Admin", "SuperUser"],
    icon: <ShoppingBag className="w-4 h-4" />,
    activeIcon: <ShoppingBag className="w-4 h-4 text-blue-600" />,
  },
  {
    label: "Place Order",
    path: "/admin/placeOrder",
    roles: ["SuperAdmin", "Admin"],
    icon: <OrderedListOutlined className="text-sm" />,
    activeIcon: <OrderedListOutlined className="text-sm text-blue-600" />,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    roles: ["SuperAdmin", "Admin"],
    icon: <ChartBar className="w-4 h-4" />,
    activeIcon: <ChartBar className="text-sm text-blue-600" />,
  },
];

type Props = {
  direction?: "horizontal" | "vertical";
};
export default function AdminTabs({ direction }: Props) {
  const { role } = useAuth();

  const visibleTabs = tabs.filter((tab) => tab.roles.includes(role!));

  return (
    <div
      className={`bg-white p-1 ${
        direction === "horizontal"
          ? "flex flex-col gap-1"
          : "flex flex-row gap-1"
      }`}
    >
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.path}
          className={({ isActive }) =>
            `
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${
              isActive
                ? "bg-gray-100 text-black"
                : "text-black hover:text-gray-700 hover:bg-gray-50"
            }
          `
          }
        >
          <span className="text-base">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
