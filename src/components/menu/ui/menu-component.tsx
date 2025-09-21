import { Search } from "lucide-react";
import CardProduk from "./card";

const MenuComponent = () => {
  return (
    <>
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
