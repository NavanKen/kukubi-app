"use client";

import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useProduk } from "@/hooks/use-produk";
import { useCart } from "@/hooks/use-cart";
import { getProfileUser } from "@/service/auth";
import { addToCart } from "@/service/cart";
import { toast } from "sonner";
import CardProdukMember from "./card-produk";
import CartModal from "./cart-modal";
import { useEffect } from "react";

const MenuMember = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const limit = 12;

  const { menuData, isLoading, total } = useProduk(search, limit, page);
  const { cartData, total: cartTotal, refetch: refetchCart } = useCart(userId);

  useEffect(() => {
    const loadData = async () => {
      fetchUser();
    };
    loadData();
  }, []);

  const fetchUser = async () => {
    const res = await getProfileUser();
    if (res.status && res.data) {
      setUserId(res.data.auth.id);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    const toastId = toast.loading("Menambahkan ke keranjang...");

    const res = await addToCart({
      user_id: userId,
      product_id: productId,
      quantity: 1,
    });

    if (res.status) {
      toast.success(res.pesan || "Berhasil ditambahkan ke keranjang", {
        id: toastId,
      });
      refetchCart();
    } else {
      toast.error(res.pesan || "Gagal menambahkan ke keranjang", {
        id: toastId,
      });
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="px-7 pt-4 pb-24 min-h-screen md:px-20 w-full">
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari menu favorit kamu..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-base outline-none transition-colors focus:border-orange-500"
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            {cartData.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartData.length}
              </span>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-52 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : menuData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuData.map((product) => (
                <CardProdukMember
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 rounded-lg bg-orange-500 text-white">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartData}
        cartTotal={cartTotal}
        userId={userId}
        refetchCart={refetchCart}
      />
    </>
  );
};

export default MenuMember;
