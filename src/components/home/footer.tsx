import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">
                  Kukubi
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Dimsum autentik langsung dari dapur dengan cita rasa yang tak
                  terlupakan. Dibuat dengan bahan-bahan pilihan dan resep turun
                  temurun.
                </p>
              </div>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Menu Utama</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300">
                    Jl. Ijen Boulevard No. 123
                    <br />
                    Malang, Jawa Timur 65144
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <a
                    href="tel:+62341123456"
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    +62 341 123 456
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <a
                    href="mailto:hello@kukubi.com"
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    hello@kukubi.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300">
                    <div>Senin - Jumat: 09.00 - 22.00</div>
                    <div>Sabtu - Minggu: 08.00 - 23.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 bg-slate-900">
        <div className="px-6 lg:px-20 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © 2025 Kukubi Dimsum. All rights reserved.
              </div>

              <div className="flex gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                >
                  Kebijakan Privasi
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                >
                  Syarat & Ketentuan
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                >
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
