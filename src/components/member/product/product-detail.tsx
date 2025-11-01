"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IProduk } from "@/types/produk.type";
import { addToCart } from "@/service/cart";
import { getProfileUser } from "@/service/auth";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviews } from "@/hooks/use-reviews";
import { createReview, getAverageRating } from "@/service/review";
import { getProdukById } from "@/service/produk";

interface ProductDetailProps {
  productId: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const router = useRouter();
  const [product, setProduct] = useState<IProduk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const {
    reviews,
    isLoading: reviewsLoading,
    refetch,
  } = useReviews(Number(productId));

  const fetchRating = useCallback(async () => {
    const res = await getAverageRating(Number(productId));
    if (res.status && res.data) {
      setAverageRating(res.data.average);
      setTotalReviews(res.data.count);
    }
  }, [productId]);

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    const res = await getProdukById(productId);

    if (!res.status && res.data) {
      setProduct(res.data as IProduk);
    }

    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
    fetchUser();
    fetchRating();
  }, [fetchProduct, fetchRating, productId]);

  const fetchUser = async () => {
    const res = await getProfileUser();
    if (res.status && res.data) {
      setUserId(res.data.auth.id);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (!product) return;

    const toastId = toast.loading("Menambahkan ke keranjang...");

    const res = await addToCart({
      user_id: userId,
      product_id: Number(productId),
      quantity: quantity,
    });

    if (res.status) {
      toast.success(res.pesan || "Berhasil ditambahkan ke keranjang", {
        id: toastId,
      });
      router.push("/member/menu");
    } else {
      toast.error(res.pesan || "Gagal menambahkan ke keranjang", {
        id: toastId,
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (!review.trim()) {
      toast.error("Review tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Mengirim review...");

    const res = await createReview({
      product_id: Number(productId),
      user_id: userId,
      rating: rating,
      review: review,
    });

    if (res.status) {
      toast.success("Review berhasil ditambahkan", { id: toastId });
      setReview("");
      setRating(5);
      refetch();
      fetchRating();
    } else {
      toast.error(res.pesan || "Gagal menambahkan review", { id: toastId });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg mb-4">Produk tidak ditemukan</p>
        <button
          onClick={() => router.back()}
          className="text-orange-600 hover:text-orange-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Detail Produk</h1>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <motion.div
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Image
              src={product.image || "/images/hero.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({totalReviews} Ulasan)
              </span>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-orange-600">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Stok: {product.stock} tersedia
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "Produk berkualitas dengan rasa yang lezat dan bahan-bahan pilihan terbaik."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Jumlah</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-4 font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {product.stock}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" />
              {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Ulasan Produk ({totalReviews})
        </h3>

        {/* Add Review Form */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Tulis Ulasan</h4>

          {/* Rating Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ulasan Anda
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Bagikan pengalaman Anda dengan produk ini..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !review.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada ulasan untuk produk ini
            </div>
          ) : (
            reviews.map((rev) => (
              <motion.div
                key={rev.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {rev.users?.avatar ? (
                      <Image
                        src={rev.users.avatar}
                        alt={rev.users.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Star size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">
                        {rev.users?.name || "Anonymous"}
                      </h5>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < rev.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(rev.created_at || "").toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-gray-700">{rev.review}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
