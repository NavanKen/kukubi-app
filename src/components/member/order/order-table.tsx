"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { IOrders } from "@/types/orders.types";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
} from "lucide-react";

interface OrderTableProps {
  userId: string;
  search: string;
  statusFilter: string;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const OrderTable = ({
  userId,
  search,
  statusFilter,
  page,
  limit,
  onPageChange,
}: OrderTableProps) => {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (search) {
      query = query.ilike("order_code", `%${search}%`);
    }

    const { data, error, count } = await query;

    if (!error && data) {
      setOrders(data as IOrders[]);
      setTotal(count || 0);
    }
    setIsLoading(false);
  }, [userId, search, statusFilter, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const channel = supabase
      .channel(`user-orders`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / limit);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "pending":
        return "from-yellow-50 to-yellow-100";
      case "processing":
        return "from-blue-50 to-blue-100";
      case "shipped":
        return "from-purple-50 to-purple-100";
      case "completed":
        return "from-green-50 to-green-100";
      case "cancelled":
        return "from-red-50 to-red-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "processing":
        return "Sedang Diproses";
      case "shipped":
        return "Dalam Pengiriman";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32" />
                  <div className="h-3 bg-gray-300 rounded w-24" />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded flex-1" />
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-28 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {orders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search || statusFilter !== "all"
                ? "Tidak Ada Pesanan Ditemukan"
                : "Belum Ada Pesanan"}
            </h3>
            <p className="text-gray-500">
              {search || statusFilter !== "all"
                ? "Coba ubah kata kunci pencarian atau filter status"
                : "Riwayat pesanan Anda akan muncul di sini"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/transaction/${order.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-br ${getStatusGradient(
                    order.status
                  )} p-4 border-b border-gray-100`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          #{String(order.order_code)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(order.created_at || "").toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      {" • "}
                      {new Date(order.created_at || "").toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Total Pembayaran
                    </span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-600">
                        Rp {order.total_amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Menampilkan {(page - 1) * limit + 1} -{" "}
            {Math.min(page * limit, total)} dari {total} pesanan
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm text-gray-700"
            >
              Sebelumnya
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                      page === pageNum
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm text-gray-700"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
