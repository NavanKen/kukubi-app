import { CheckCircle, Clock, Send } from "lucide-react";

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

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 relative">
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]
            bg-[size:80px_80px]
            bg-[position:40px_40px]
          "
        />
        <div className="absolute inset-0 shadow-inner pointer-events-none" />

        <div className="relative z-10 px-6 md:px-20 py-24">
          <div className="flex justify-center text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
              Kenapa harus beli di{" "}
              <span className="text-orange-600">Kukubi</span> ?
            </h1>
          </div>

          <div className="max-w-6xl mx-auto">
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

export default About;
