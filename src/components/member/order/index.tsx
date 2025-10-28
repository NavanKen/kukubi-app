"use client";

import { useState, useEffect } from "react";
import { getProfileUser } from "@/service/auth";
import { Search } from "lucide-react";
import OrderTable from "./order-table";

const OrderMember = () => {
  const [userId, setUserId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 2;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await getProfileUser();
    if (res.status && res.data) {
      setUserId(res.data.auth.id);
    }
  };

  return (
    <div className="px-7 pt-4 pb-24 min-h-screen md:px-20 w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Riwayat Pesanan
        </h1>
        <p className="text-gray-600">Lacak dan kelola pesanan Anda</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan ID atau status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-base outline-none transition-colors focus:border-orange-500"
          />
        </div>
      </div>

      {userId && (
        <OrderTable
          userId={userId}
          search={search}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default OrderMember;
