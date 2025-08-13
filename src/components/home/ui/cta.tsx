import Image from "next/image";
import Button from "./button";

const KukubiCTA = () => {
  return (
    <div className="relative mt-20">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center p-10 bg-stone-50 shadow-xl rounded-lg gap-10">
        <div className="max-w-3xl mt-12 md:mt-0">
          <h1 className="text-4xl font-bold mb-6">
            Siap menikmati kelezatan{" "}
            <span className="text-orange-600">Dimsum?</span>
          </h1>
          <p className="text-xl text-gray-600 pb-7">
            Kini pemesanan dimsum lebih mudah dan cepat. Cukup dari rumah, Anda
            bisa memantau pesanan tanpa harus antre ke restoran.
          </p>
          <Button
            variant="custom"
            className="bg-gradient-to-r px-8 py-2 from-orange-500 to-red-500 text-lg text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            Pesan Sekarang
          </Button>
        </div>
        <div className="relative w-full max-w-md md:max-w-lg h-52 md:h-72">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-300 to-yellow-300 shadow-2xl transform rotate-6 opacity-60"></div>
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-300 to-yellow-300 shadow-2xl transform rotate-12 opacity-60"></div>
          <div className="absolute inset-0 rounded-2xl bg-yellow-300 blur-3xl opacity-70 shadow-xl transform rotate-3"></div>
          <div className="relative w-full h-full transform rotate-3 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/hero.jpg"
              alt="dimsum-image"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KukubiCTA;
