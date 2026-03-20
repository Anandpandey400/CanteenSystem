import {  type ComponentType,  } from "react";
import Login from "../Pages/Auth/Login"
import MasterTab from "../Pages/Master/MasterTab"
import Inventory from "../Pages/Admin/Inventory";
import MenuRecipe from "../Pages/Admin/MenuRecipe";
import Wallets from "../Pages/Admin/Wallets";
import Orders from "../Pages/Admin/Orders";
import Reports from "../Pages/Admin/Reports";
import UserHome from "../Pages/User/UserHome";
import OrderHistory from "../Pages/User/OrderHistory";
import UserWallet from "../Pages/User/UserWallet";
import PlaceOrder from "../Pages/Admin/PlaceOrder";
import OrderReportDetails from "../Pages/Reports/OrderReportDetails";
export type AppRoute = {
  path: string;
  element: ComponentType<any>;
  isPrivate?: boolean;
  roles?: string[];
};

export const routes: AppRoute[] = [
  // Public
  {
    path: "/",
    element: Login,
  },


  ///Admin
  {
    path: "/admin/inventory",
    isPrivate: true,
    roles: ["SuperAdmin", "Admin"],
    element: Inventory,
  },
  {
    path: "/admin/menu",
    isPrivate: true,
    roles: ["SuperAdmin", "Admin"],
    element: MenuRecipe,
  },
  {
    path: "/admin/wallets",
    isPrivate: true,
    roles: ["SuperAdmin","Admin"],
    element: Wallets,
  },
  {
    path: "/admin/orders",
    isPrivate: true,
    roles: ["SuperAdmin","Admin","SuperUser"],
    element: Orders,
  },
  {
    path : "/admin/reports",
    isPrivate: true,
    roles: ["SuperAdmin", "Admin"],
    element : Reports,
  },
  // // Master
  {
    path : "/master",
    isPrivate: true,
    roles: ["SuperAdmin"],
    element : MasterTab ,
  },
   {
    path : "/admin/placeOrder",
    isPrivate: true,
    roles: ["SuperAdmin","Admin", "SuperUser"],
    element : PlaceOrder ,
  },
  {
  path: "/admin/order-details/:id",
  isPrivate: true,
  roles: ["SuperAdmin","Admin","SuperUser"],
  element: OrderReportDetails,
},

  // //user 
  {
    path : "/user/home",
    isPrivate: true,
    roles: ["User"],
    element : UserHome,
  },
  {
    path : "/user/orderHistory",
    isPrivate: true,
    roles: ["User"],
    element : OrderHistory
  },
  
   {
    path : "/user/wallet",
    isPrivate: true,
    roles: ["User"],
    element : UserWallet,
  }
  
];
