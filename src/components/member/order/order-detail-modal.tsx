"use client";

import { X, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDetailOrder } from "@/hooks/use-detail-order";
import { updateOrderStatus } from "@/service/order";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

interface MidtransSnapResult {
  transaction_status?: string;
}

interface MidtransSnap {
  pay: (
    token: string,
    options: {
      onSuccess?: (result: MidtransSnapResult) => void;
      onPending?: (result: MidtransSnapResult) => void;
      onError?: (result: MidtransSnapResult) => void;
      onClose?: () => void;
    }
  ) => void;
}

interface WindowWithSnap extends Window {
  snap?: MidtransSnap;
}

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetailModal = ({ orderId, onClose }: OrderDetailModalProps) => {
  const { orderItems, order, isLoading, refetch } = useDetailOrder(orderId);
  const [isPaying, setIsPaying] = useState(false);

  const currentOrder = order[0];

  const handlePayOrder = async () => {
    if (!currentOrder) return;
    if (typeof window === "undefined") return;

    const win = window as WindowWithSnap;
    const snap = win.snap;
    if (!snap) {
      toast.error("Layanan pembayaran belum siap, coba beberapa saat lagi");
      return;
    }

    setIsPaying(true);
    const toastId = toast.loading("Menghubungkan ke pembayaran...");

    try {
      const response = await fetch("/api/midtrans/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: Number(currentOrder.id),
          orderCode: currentOrder.order_code,
          amount: currentOrder.total_amount,
          customerName: currentOrder.customer_name,
          phone: currentOrder.phone ?? undefined,
          address: currentOrder.addres ?? undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat transaksi Midtrans");
      }

      const midtransData: { token?: string } = await response.json();

      if (!midtransData.token) {
        throw new Error("Token pembayaran tidak tersedia");
      }

      toast.dismiss(toastId);

      snap.pay(midtransData.token, {
        onSuccess: async () => {
          try {
            const res = await updateOrderStatus(orderId, "processing");
            if (!res.status) {
              console.error("Gagal update status order", res.pesan);
            }
            refetch();
          } catch (e) {
            console.error("Gagal update status order setelah bayar", e);
          }
        },
        onPending: () => {
          // tetap pending
        },
        onError: async (result: MidtransSnapResult) => {
          console.error("Midtrans error", result);
          if (
            result?.transaction_status === "expire" ||
            result?.transaction_status === "cancel"
          ) {
            try {
              await updateOrderStatus(orderId, "cancelled");
              refetch();
            } catch (e) {
              console.error("Gagal update status order ke cancelled", e);
            }
          }
          toast.error("Pembayaran gagal atau dibatalkan");
        },
        onClose: () => {
          // user menutup popup tanpa membayar
        },
      });
    } catch (error) {
      console.error("Gagal memulai pembayaran", error);
      toast.error("Gagal memulai pembayaran", { id: toastId });
    } finally {
      setIsPaying(false);
    }
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
        {currentOrder && currentOrder.status === "pending" && (
          <div className="border-t border-gray-200 p-6">
            <button
              onClick={handlePayOrder}
              disabled={isPaying}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? "Menghubungkan..." : "Bayar Sekarang"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;
