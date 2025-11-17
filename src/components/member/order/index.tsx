"use client";

import { useState, useEffect } from "react";
import { getProfileUser } from "@/service/auth";
import { Search, Filter } from "lucide-react";
import OrderTable from "./order-table";

const OrderMember = () => {
  const [userId, setUserId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await getProfileUser();
    if (res.status && res.data) {
      setUserId(res.data.auth.id);
    }
  };

  const statusOptions = [
    { value: "all", label: "Semua Status", color: "gray" },
    { value: "pending", label: "Menunggu", color: "yellow" },
    { value: "processing", label: "Diproses", color: "blue" },
    { value: "shipped", label: "Dikirim", color: "purple" },
    { value: "completed", label: "Selesai", color: "green" },
    { value: "cancelled", label: "Dibatalkan", color: "red" },
  ];

  return (
    <div className="px-7 pt-4 pb-24 min-h-screen md:px-20 w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Riwayat Pesanan
        </h1>
        <p className="text-gray-600">Lacak dan kelola pesanan Anda</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan ID pesanan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-base outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-base outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.25rem",
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {userId && (
        <OrderTable
          userId={userId}
          search={search}
          statusFilter={statusFilter}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default OrderMember;
