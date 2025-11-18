"use client";

import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDetailOrder } from "@/hooks/use-detail-order";
import { updateOrderStatus } from "@/service/order";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderDetailProps {
  orderId: string;
}

const OrderDetail = ({ orderId }: OrderDetailProps) => {
  const { orderItems, order, isLoading, refetch } = useDetailOrder(orderId);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const router = useRouter();

  const currentOrder = order[0];

  const handleCancelOrder = () => {
    if (!currentOrder) return;

    if (currentOrder.status === "shipped") {
      toast.error("Pesanan yang sudah dikirim tidak dapat dibatalkan");
      return;
    }

    if (currentOrder.status === "completed") {
      toast.error("Pesanan yang sudah selesai tidak dapat dibatalkan");
      return;
    }

    if (currentOrder.status === "cancelled") {
      toast.error("Pesanan sudah dibatalkan");
      return;
    }

    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    setIsCancelling(true);
    const toastId = toast.loading("Membatalkan pesanan...");

    const res = await updateOrderStatus(orderId, "cancelled");

    if (res.status) {
      toast.success("Pesanan berhasil dibatalkan", { id: toastId });
      setShowCancelModal(false);
      refetch();
    } else {
      toast.error(res.pesan || "Gagal membatalkan pesanan", { id: toastId });
    }

    setIsCancelling(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case "processing":
        return <Package className="w-6 h-6 text-blue-600" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-purple-600" />;
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-600" />;
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="w-40 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="w-48 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="w-32 h-3 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="w-32 h-5 bg-gray-200 rounded mb-4 animate-pulse" />

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg animate-pulse"
                >
                  <div className="w-20 h-20 bg-gray-300 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="w-40 h-4 bg-gray-300 rounded" />
                    <div className="w-24 h-4 bg-gray-300 rounded" />
                  </div>
                  <div className="w-20 h-5 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-6 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>

          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Batalkan Pesanan
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Order #{String(orderId)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tidak, Kembali
              </button>
              <button
                onClick={confirmCancelOrder}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30"
              >
                {isCancelling ? "Memproses..." : "Ya, Batalkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">
            #{currentOrder?.order_code}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {currentOrder && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(currentOrder.status)}
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {getStatusText(currentOrder.status)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(currentOrder.created_at || "").toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Item Pesanan
          </h3>
          <div className="space-y-3">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.products?.image || "/images/hero.jpg"}
                    alt={item.products?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.products?.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {currentOrder && (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Pembayaran
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  Rp {currentOrder.total_amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}
        </div>

        {currentOrder &&
          currentOrder.status !== "cancelled" &&
          currentOrder.status !== "completed" &&
          currentOrder.status !== "shipped" && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Membatalkan..." : "Batalkan Pesanan"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default OrderDetail;
