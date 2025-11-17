"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { ICart } from "@/types/cart.type";
import { updateCartQuantity, removeFromCart, clearCart } from "@/service/cart";
import { toast } from "sonner";
import { useState } from "react";
import CheckoutModal from "./checkout-modal";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: ICart[];
  cartTotal: number;
  userId: string;
  refetchCart: () => void;
}

const CartModal = ({
  isOpen,
  onClose,
  cartData,
  cartTotal,
  userId,
  refetchCart,
}: CartModalProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const res = await updateCartQuantity(cartId, newQuantity);
    if (res.status) {
      refetchCart();
    } else {
      toast.error(res.pesan || "Gagal update quantity");
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    const toastId = toast.loading("Menghapus item...");
    const res = await removeFromCart(cartId);

    if (res.status) {
      toast.success("Item berhasil dihapus", { id: toastId });
      refetchCart();
    } else {
      toast.error(res.pesan || "Gagal menghapus item", { id: toastId });
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Yakin ingin mengosongkan keranjang?")) return;

    const toastId = toast.loading("Mengosongkan keranjang...");
    const res = await clearCart(userId);

    if (res.status) {
      toast.success("Keranjang berhasil dikosongkan", { id: toastId });
      refetchCart();
    } else {
      toast.error(res.pesan || "Gagal mengosongkan keranjang", { id: toastId });
    }
  };

  const handleCheckout = () => {
    if (cartData.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Keranjang Belanja
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartData.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.products?.image || "/images/hero.jpg"}
                        alt={item.products?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.products?.name}
                      </h3>
                      <p className="text-orange-600 font-bold mt-1">
                        Rp {(item.products?.price || 0).toLocaleString("id-ID")}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= (item.products?.stock || 0)
                            }
                            className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        Rp{" "}
                        {(
                          (item.products?.price || 0) * item.quantity
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartData.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  Rp {cartTotal.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClearCart}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Kosongkan
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartData={cartData}
        cartTotal={cartTotal}
        userId={userId}
        refetchCart={refetchCart}
        closeCartModal={onClose}
      />
    </>
  );
};

export default CartModal;
