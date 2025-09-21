"use client";

import type React from "react";
import { Home, UtensilsCrossed, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useActivePath } from "@/hooks/use-active-path";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Beranda",
    href: "/member",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "menu",
    label: "Menu",
    href: "/member/menu",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    id: "orders",
    label: "Pesanan",
    href: "/member/order",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    id: "profile",
    label: "Profil",
    href: "/member/profile",
    icon: <User className="w-5 h-5" />,
  },
];

const BottomNavigation = () => {
  const activeTab = useActivePath();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? "text-orange-600 bg-orange-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div
              className={`transition-transform ${
                activeTab === item.id ? "scale-110" : ""
              }`}
            >
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
