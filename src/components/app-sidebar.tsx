"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Package,
  Tags,
  Users,
  CreditCard,
  Truck,
  Percent,
  Receipt,
  Wallet,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavTransaction } from "@/components/nav-transaction";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavKeuangan } from "./nav-keuangan";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMasterData } from "./nav-master-data";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
  ],
  transactionMenu: [
    {
      name: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      name: "Pergerakan Stok",
      url: "/stock-movements",
      icon: Boxes,
    },
  ],

  keuanganData: [
    {
      title: "Pengeluaran",
      url: "/expenses",
      icon: Receipt,
    },
    {
      title: "Laporan Penjualan",
      url: "/reports/sales",
      icon: Wallet,
    },
  ],
  masterData: [
    {
      title: "Produk",
      url: "/admin/products",
      icon: Package,
    },
    {
      title: "Kategori",
      url: "/admin/categories",
      icon: Tags,
    },
    {
      title: "Pengguna",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Metode Pembayaran",
      url: "/admin/payment-methods",
      icon: CreditCard,
    },
    {
      title: "Metode Pengiriman",
      url: "/admin/shipping-methods",
      icon: Truck,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTransaction transactionMenu={data.transactionMenu} />
        <NavKeuangan items={data.keuanganData} />
        <NavMasterData items={data.masterData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
