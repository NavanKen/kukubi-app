import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

const CardProduk = () => {
  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl cursor-pointer transition-all duration-200">
        <div className="w-full relative h-52">
          <Image
            src={"/images/hero.jpg"}
            alt="image"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Siomay Ayam Udang
          </h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Siomay lezat dengan isian ayam dan udang pilihan, disajikan hangat.
          </p>{" "}
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(125)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">4.8 (125 Ulasan)</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-orange-600">Rp 25.000</h2>
            <button className="cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full hover:from-orange-600 hover:to-red-600 duration-200 ease-in-out hover:scale-105 transition-all">
              <ShoppingCart className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardProduk;
