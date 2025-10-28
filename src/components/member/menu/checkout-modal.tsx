"use client";

import { X, CreditCard, Wallet } from "lucide-react";
import { ICart } from "@/types/cart.type";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import supabase from "@/lib/supabase/client";
import { clearCart } from "@/service/cart";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: ICart[];
  cartTotal: number;
  userId: string;
  refetchCart: () => void;
  closeCartModal: () => void;
}

interface PaymentMethod {
  id: number;
  name: string;
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
      fetchUserName();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    const { data } = await supabase.from("payment_methods").select("*");
    if (data) {
      setPaymentMethods(data);
      if (data.length > 0) {
        setSelectedPayment(data[0].id);
      }
    }
  };

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

  const handleCheckout = async () => {
    // if (!selectedPayment) {
    //   toast.error("Pilih metode pembayaran");
    //   return;
    // }

    setIsProcessing(true);
    const toastId = toast.loading("Memproses pesanan...");

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          customer_name: customerName,
          order_type: "online",
          // payment_method_id: selectedPayment,
          status: "pending",
          total_amount: cartTotal,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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

      // Update product stock
      for (const item of cartData) {
        const newStock = (item.products?.stock || 0) - item.quantity;
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product_id);
      }

      // Clear cart
      await clearCart(userId);

      toast.success("Pesanan berhasil dibuat!", { id: toastId });
      refetchCart();
      onClose();
      closeCartModal();
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Summary */}
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

          {/* Customer Name */}
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

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Metode Pembayaran
            </h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                    className="w-4 h-4 text-orange-600"
                  />
                  {method.name.toLowerCase().includes("cash") ? (
                    <Wallet className="w-5 h-5 text-orange-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-orange-600" />
                  )}
                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={handleCheckout}
            disabled={isProcessing || !customerName}
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
