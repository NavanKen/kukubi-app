import {
  CheckCircle,
  Clock,
  Send,
  Quote,
  Star,
  Heart,
  Utensils,
  ChefHat,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: CheckCircle,
    title: "Kualitas Terjamin",
    description:
      "Setiap dimsum dibuat dengan bahan-bahan segar pilihan dan resep turun temurun yang telah terjaga kualitasnya.",
  },
  {
    icon: Clock,
    title: "Dibuat Fresh Setiap Hari",
    description:
      "Dimsum kami selalu dibuat segar setiap hari untuk memastikan rasa dan kualitas yang optimal saat sampai ke tangan Anda.",
  },
  {
    icon: Send,
    title: "Pengiriman Cepat",
    description:
      "Sistem pengiriman yang efisien memastikan pesanan Anda sampai dalam kondisi hangat dan tepat waktu.",
  },
];

const WhyUs = () => {
  return (
    <>
      <div className="min-h-screen bg-white px-6 md:px-20 py-24">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-orange-500 to-red-500 px-6 md:px-20 py-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Quote className="absolute top-20 left-10 w-16 h-16 md:w-28 md:h-28 text-white/10 transform -rotate-12" />
            <Quote className="absolute bottom-2 right-20 w-12 h-12 md:w-20 md:h-20 text-white/10 transform rotate-45" />
            <Utensils className="absolute top-40 left-1/4 w-14 h-14 text-white/10 transform rotate-12" />
            <Utensils className="absolute top-60 right-1/3 w-10 h-10 text-white/10 transform -rotate-45" />
            <ChefHat className="absolute bottom-40 left-16 w-18 h-18 text-white/10 transform rotate-12" />
            <Quote className="absolute bottom-60 right-16 w-20 h-20 text-white/10 transform rotate-45" />
            <Star className="absolute bottom-20 left-1/3 w-8 h-8 text-white/10 transform -rotate-12" />
            <Utensils className="absolute top-1/2 right-10 w-12 h-12 text-white/10 transform -rotate-12" />
            <Utensils className="absolute top-1/3 left-1/2 w-16 h-16 text-white/10 transform rotate-12" />
            <ChefHat className="absolute bottom-1/3 right-1/4 w-14 h-14 text-white/10 transform -rotate-45" />
            <div className="md:hidden">
              <Quote className="absolute top-16 right-8 w-8 h-8 text-white/10 transform rotate-12" />
              <Star className="absolute bottom-16 left-8 w-6 h-6 text-white/10 transform -rotate-12" />
              <Heart className="absolute top-1/2 left-4 w-10 h-10 text-white/10 transform rotate-45" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col text-center items-center mb-16 text-white">
            <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
              Kenapa harus beli di <span className="">Kukubi</span> ?
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-2xl">
              Kami selalu menghadirkan dimsum segar dengan bahan pilihan, harga
              terjangkau, dan pelayanan terbaik. Inilah alasan kenapa ribuan
              pelanggan memilih Kukubi setiap harinya.
            </p>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    5000+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Pelanggan Puas
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    4.8★
                  </div>
                  <div className="text-gray-600 font-medium">
                    Rating Rata-rata
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    50+
                  </div>
                  <div className="text-gray-600 font-medium">Varian Menu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyUs;
