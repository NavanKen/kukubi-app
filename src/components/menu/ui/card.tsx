"use client";

import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CardProdukProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    image: string;
    averageRating: number;
    totalReviews: number;
  };
  onAddToCart: (productId: number) => void;
}

const CardProduk = ({ product, onAddToCart }: CardProdukProps) => {
  const router = useRouter();

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl cursor-pointer transition-all duration-200">
        <div
          className="w-full relative h-52"
          onClick={() => router.push(`/menu/${product.id}`)}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2
            className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={() => router.push(`/menu/${product.id}`)}
          >
            {product.name}
          </h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(product.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.averageRating.toFixed(1)} ({product.totalReviews} Ulasan)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-orange-600">
              Rp {product.price.toLocaleString("id-ID")}
            </h2>
            <button
              onClick={() => product.id && onAddToCart(product.id)}
              className="cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full hover:from-orange-600 hover:to-red-600 duration-200 ease-in-out hover:scale-105 transition-all"
            >
              <ShoppingCart className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardProduk;
