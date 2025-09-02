import { Search } from "lucide-react";
import CardProduk from "./card";

const MenuComponent = () => {
  return (
    <>
      <div className="mt-7">
        <div className="text-center mb-7">
          <h1 className="text-gray-800 font-bold text-3xl mb-3">
            Menu Dim<span className="text-orange-600">sum Kami</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">
            Pilihan dimsum autentik yang dibuat fresh setiap hari dengan resep
            turun temurun dan bahan-bahan pilihan terbaik
          </p>
        </div>
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="searchInput"
              type="text"
              placeholder="Cari menu favorit kamu..."
              className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-base outline-none transition-colors focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardProduk />
        <CardProduk />
        <CardProduk />
        <CardProduk />
        <CardProduk />
      </div>
    </>
  );
};

export default MenuComponent;
