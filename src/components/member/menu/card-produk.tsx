import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { IProduk } from "@/types/produk.type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAverageRating } from "@/service/review";

interface CardProdukMemberProps {
  product: IProduk;
  onAddToCart: (productId: number) => void;
}

const CardProdukMember = ({ product, onAddToCart }: CardProdukMemberProps) => {
  const defaultImage = "/images/hero.jpg";
  const router = useRouter();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      const res = await getAverageRating(Number(product.id));
      if (res.status && res.data) {
        setAverageRating(res.data.average);
        setTotalReviews(res.data.count);
      }
    };
    fetchRating();
  }, [product.id]);

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200">
      <div
        className="w-full relative h-52 cursor-pointer"
        onClick={() => router.push(`/member/menu/${product.id}`)}
      >
        <Image
          src={product.image || defaultImage}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Stok Habis</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors"
          onClick={() => router.push(`/member/menu/${product.id}`)}
        >
          {product.name}
        </h2>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
          {product.description || "Produk berkualitas dengan rasa yang lezat"}
        </p>
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-orange-600">
              Rp {product.price.toLocaleString("id-ID")}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Stok: {product.stock}</p>
          </div>
          <button
            onClick={() => product.id && onAddToCart(product.id)}
            disabled={product.stock === 0}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full hover:from-orange-600 hover:to-red-600 duration-200 ease-in-out hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProdukMember;
