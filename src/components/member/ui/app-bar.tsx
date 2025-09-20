"use client";

import { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/service/auth";
import { toast } from "sonner";

const AppBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const userData = {
    name: "Ahmad Rizky",
    email: "ahmad@gmail.com",
    avatar: null,
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAccountSettings = () => {
    router.push("/member/settings");
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Mohon Tunggu Sebentar...");
    const res = await logout();

    if (!res.status) {
      toast.error("Gagal untuk keluar");
    }

    setIsDropdownOpen(false);
    toast.success("Berhasil Keluar", { id: toastId });
    router.push("/auth/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 safe-area-pb z-50">
      <div className="flex items-center justify-between mx-4">
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Kukubi
          </span>
        </div>

        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="relative w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
              {userData.avatar ? (
                <Image
                  fill
                  src={userData.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {userData.name}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-32">
                {userData.email}
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top-right ${
              isDropdownOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  {userData.avatar ? (
                    <Image
                      src={userData.avatar}
                      alt="Profile"
                      fill
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {userData.name}
                  </div>
                  <div className="text-sm text-gray-600">{userData.email}</div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={handleAccountSettings}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors duration-150" />
                <span className="group-hover:text-gray-900">
                  Pengaturan Akun
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-150 group"
              >
                <LogOut className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors duration-150" />
                <span className="group-hover:text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
