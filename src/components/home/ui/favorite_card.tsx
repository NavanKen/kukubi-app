import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FavoritCard = () => {
  return (
    <>
      <Link href={"/"}>
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-150 border border-gray-100 p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-orange-600 font-bold text-2xl">
                Siomay Ayam Udang
              </h3>
              <p className="bg-gradient-to-br from-orange-500 to-red-500 py-1 px-2 rounded-full text-gray-100 font-semibold">
                Favorit Pelanggan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-orange-600 text-lg font-bold">Rp 43.000</h3>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative w-full h-[18rem] overflow-hidden rounded-lg">
            <Image
              src={"/images/hero.jpg"}
              alt="produk_favorit"
              className="object-cover"
              fill
            />
          </div>
        </div>
      </Link>
    </>
  );
};

export default FavoritCard;
