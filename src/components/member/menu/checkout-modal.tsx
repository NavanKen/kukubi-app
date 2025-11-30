"use client";

import { X } from "lucide-react";
import { ICart } from "@/types/cart.type";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import supabase from "@/lib/supabase/client";
import { clearCart } from "@/service/cart";
import environment from "@/config/environment";

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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: ICart[];
  cartTotal: number;
  userId: string;
  refetchCart: () => void;
  closeCartModal: () => void;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  cartData,
  cartTotal,
  userId,
  refetchCart,
  closeCartModal,
}: CheckoutModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("id", userId)
        .single();

      if (data) {
        setCustomerName(data.name);
      }
    };
    if (isOpen) {
      fetchUserName();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;
    const win = window as WindowWithSnap;
    if (win.snap) return;

    const script = document.createElement("script");
    const baseUrl =
      environment.MIDTRANS_BASE_URL || "https://app.sandbox.midtrans.com";
    script.src = `${baseUrl}/snap/snap.js`;
    const clientKey = environment.MIDTRANS_CLIENT_KEY || "";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!address || !phone) {
      toast.error("Mohon isi alamat dan nomor HP");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Memproses pesanan...");

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          customer_name: customerName,
          order_type: "online",
          status: "pending",
          total_amount: cartTotal,
          order_code: crypto.randomUUID().slice(0, 8),
          addres: address,
          phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartData.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of cartData) {
        const newStock = (item.products?.stock || 0) - item.quantity;
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product_id);
      }

      const midtransResponse = await fetch(
        "/api/midtrans/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderData.id,
            orderCode: orderData.order_code,
            amount: cartTotal,
            customerName,
            phone,
            address,
          }),
        }
      );

      if (!midtransResponse.ok) {
        throw new Error("Gagal membuat transaksi Midtrans");
      }

      const midtransData: { token?: string } = await midtransResponse.json();

      await clearCart(userId);
      refetchCart();
      onClose();
      closeCartModal();

      let snap: MidtransSnap | null = null;

      if (typeof window !== "undefined") {
        const win = window as WindowWithSnap;
        snap = win.snap ?? null;
      }

      if (!midtransData.token || !snap) {
        toast.error("Gagal memulai pembayaran Midtrans", { id: toastId });
        return;
      }

      toast.success("Pesanan berhasil dibuat, membuka pembayaran...", {
        id: toastId,
      });

      snap.pay(midtransData.token, {
        onSuccess: async () => {
          try {
            await supabase
              .from("orders")
              .update({ status: "processing" })
              .eq("id", orderData.id);
          } catch (e) {
            console.error("Gagal update status order setelah bayar", e);
          }
        },
        onPending: () => {
          // tetap pending, tidak perlu update
        },
        onError: async (result: MidtransSnapResult) => {
          console.error("Midtrans error", result);
          if (
            result?.transaction_status === "expire" ||
            result?.transaction_status === "cancel"
          ) {
            try {
              await supabase
                .from("orders")
                .update({ status: "cancelled" })
                .eq("id", orderData.id);
            } catch (e) {
              console.error("Gagal update status order ke cancelled", e);
            }
          }
          toast.error("Pembayaran gagal atau dibatalkan");
        },
        onClose: () => {
          // user menutup popup tanpa membayar, biarkan status tetap pending
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Gagal memproses pesanan", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Ringkasan Pesanan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {cartData.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.products?.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    Rp{" "}
                    {(
                      (item.products?.price || 0) * item.quantity
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Pemesan
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Masukkan nama"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Pengiriman
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor HP yang dapat dihubungi
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Contoh: 081234567890"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <button
            onClick={handleCheckout}
            disabled={
              isProcessing || !customerName || !address || !phone
            }
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Memproses..." : "Konfirmasi Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
