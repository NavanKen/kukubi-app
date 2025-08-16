import FavoritCard from "./ui/favorite_card";

const Produk = () => {
  return (
    <>
      <div className="relative px-7 py-24 min-h-screen md:px-20 w-full overflow-x-hidden">
        <div className="absolute rotate-6 bottom-4 right-7 md:bottom-50 md:right-10 grid grid-cols-5 gap-2 -z-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 opacity-70 rounded-full"
            ></div>
          ))}
        </div>
        <div className="absolute top-5 -right-15 md:-right-24 bg-gradient-to-br from-orange-500 to-red-500 opacity-70 w-32 h-32 md:w-52 md:h-52 rounded-full"></div>
        <div className="absolute top-20 left-5 w-[2px] h-24 bg-orange-600 -z-10"></div>
        <div className="hidden lg:block absolute bottom-8 right-5 w-7 h-7 bg-orange-600 rounded-full -z-10"></div>

        <div className="text-center space-y-3 mb-16">
          <h1 className="text-4xl font-bold">
            Menu <span className="text-orange-600">Favorit</span>
          </h1>
          <p className="text-xl text-gray-600">
            Dimsum favorit pelanggan dengan rating tertinggi
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          <div className="w-full lg:max-w-5/12">
            <FavoritCard />
          </div>
          <div className="w-full lg:w-1/2 lg:max-w-lg ">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">AR</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Andi Rahman</h4>
                <p className="text-gray-600">Karyawan Swasta</p>
                <p className="text-sm text-gray-500">5 hari yang lalu</p>
              </div>
            </div>
            <blockquote className="text-xl text-gray-800 mb-8 leading-relaxed text-center lg:text-left">
              &ldquo;Dimsum Mania sudah jadi langganan keluarga kami. Anak-anak
              suka banget sama Siomay Ayam Udang-nya. Packaging juga rapi dan
              higienis. Recommended!&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
};

export default Produk;
