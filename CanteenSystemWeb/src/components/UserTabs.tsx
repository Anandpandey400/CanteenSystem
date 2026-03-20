import { History, Home, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    label: "Home",
    icon: <Home className="w-4 h-4" />,
    path: "/user/home",
  },
  {
    label: "Order History",
    icon: <History className="w-4 h-4" />,
    path: "/user/orderHistory",
  },
  {
    label: "Wallet",
    icon: <Wallet className="w-4 h-4" />,
    path: "/user/wallet",
  },
];

type Props = {
  direction?: "horizontal" | "vertical";
};

export default function UserTabs({ direction }: Props) {
  return (
    <div
      className={`bg-white p-1 ${
        direction === "horizontal"
          ? "flex flex-col gap-1"
          : "flex flex-row gap-1"
      }`}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.path}
          className={({ isActive }) =>
            `
            flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${
              isActive
                ? "bg-gray-100 text-black"
                : "text-black hover:bg-gray-50"
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
