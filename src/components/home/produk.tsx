import CardProduk from "./ui/CardProduk";

const Produk = () => {
  return (
    <>
      <div className="relative px-7 py-24 min-h-screen md:px-20 w-full">
        <div className="absolute rotate-6 bottom-50 right-10 grid grid-cols-5 gap-2 -z-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 opacity-70 rounded-full"
            ></div>
          ))}
        </div>
        <div className="absolute top-20 left-5 w-[2px] h-24 bg-orange-600 -z-10"></div>
        <div className="hidden lg:block absolute bottom-8 right-5 w-7 h-7 bg-orange-600 rounded-full -z-10"></div>

        <div className="text-center space-y-3 mb-6">
          <h1 className="text-4xl font-bold">
            Menu <span className="text-orange-600">Favorit</span>
          </h1>
          <p className="text-xl text-gray-600">
            Dimsum favorit pelanggan dengan rating tertinggi
          </p>
        </div>
        <div className="flex justify-center items-center gap-8 flex-wrap lg:flex-nowrap">
          <CardProduk />
          <CardProduk />
          <CardProduk />
        </div>
      </div>
    </>
  );
};

export default Produk;
