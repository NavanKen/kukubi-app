"use client";

import { Search } from "lucide-react";
import CardProduk from "./card";
import { useProduk } from "@/hooks/use-produk";
import { useEffect, useState } from "react";
import { getAverageRating } from "@/service/review";

const MenuComponent = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [ratings, setRatings] = useState<
    Record<number, { average: number; count: number }>
  >({});

  const { menuData, isLoading, total } = useProduk(search, limit, page);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!menuData || menuData.length === 0) return;

      const ratingResults = await Promise.all(
        menuData.map(async (item) => {
          const res = await getAverageRating(item.id!);
          return {
            id: item.id,
            average: res.data?.average || 0,
            count: res.data?.count || 0,
          };
        })
      );

      const ratingMap = ratingResults.reduce((acc, r) => {
        if (r.id !== undefined) {
          acc[r.id] = { average: r.average, count: r.count };
        }
        return acc;
      }, {} as Record<number, { average: number; count: number }>);

      setRatings(ratingMap);
    };

    fetchRatings();
  }, [menuData]);

  return (
    <>
      <div className="mb-12 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="searchInput"
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
            {menuData.map((product) => {
              return (
                <CardProduk
                  key={product.id}
                  product={{
                    id: product.id!,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image!,
                    averageRating: ratings[product.id!]?.average ?? 0,
                    totalReviews: ratings[product.id!]?.count ?? 0,
                  }}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MenuComponent;
