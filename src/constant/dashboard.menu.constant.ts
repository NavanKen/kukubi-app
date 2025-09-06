import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Package,
  Users,
  Receipt,
  Wallet,
} from "lucide-react";

export const sidebarAdmin = [
  {
    label: "Beranda",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Transaksi",
    items: [
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingCart,
      },
      // {
      //   title: "Pergerakan Stok",
      //   url: "/stock-movements",
      //   icon: Boxes,
      // },
    ],
  },
  {
    label: "Keuangan",
    items: [
      {
        title: "Pengeluaran",
        url: "/admin/expenses",
        icon: Receipt,
      },
      {
        title: "Laporan Penjualan",
        url: "/reports/sales",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Master Data",
    items: [
      {
        title: "Produk",
        url: "/admin/products",
        icon: Package,
      },
      {
        title: "Pengguna",
        url: "/admin/users",
        icon: Users,
      },
      // {
      //   title: "Metode Pembayaran",
      //   url: "/admin/payment-methods",
      //   icon: CreditCard,
      // },
      // {
      //   title: "Metode Pengiriman",
      //   url: "/admin/shipping-methods",
      //   icon: Truck,
      // },
    ],
  },
];

export const sidebarCashier = [{}];
