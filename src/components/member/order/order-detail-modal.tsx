"use client";

import { X, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDetailOrder } from "@/hooks/use-detail-order";
import { updateOrderStatus } from "@/service/order";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetailModal = ({ orderId, onClose }: OrderDetailModalProps) => {
  const { orderItems, order, isLoading, refetch } = useDetailOrder(orderId);
  const [isCancelling, setIsCancelling] = useState(false);

  const currentOrder = order[0];

  const handleCancelOrder = async () => {
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

    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

    setIsCancelling(true);
    const toastId = toast.loading("Membatalkan pesanan...");

    const res = await updateOrderStatus(orderId, "cancelled");

    if (res.status) {
      toast.success("Pesanan berhasil dibatalkan", { id: toastId });
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
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Pesanan</h2>
            <p className="text-sm text-gray-500 mt-1">
              Order #{String(orderId).slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentOrder && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(currentOrder.status)}
                <div>
                  <p className="font-semibold text-gray-900">
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

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Item Pesanan</h3>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
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
                    <p className="text-sm text-gray-600">
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
          </div>

          {/* Total */}
          {currentOrder && (
            <div className="border-t border-gray-200 pt-4">
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

        {/* Footer */}
        {currentOrder &&
          currentOrder.status !== "cancelled" &&
          currentOrder.status !== "completed" &&
          currentOrder.status !== "shipped" && (
            <div className="border-t border-gray-200 p-6">
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

export default OrderDetailModal;
