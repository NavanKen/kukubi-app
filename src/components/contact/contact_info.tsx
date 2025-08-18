import { Clock, Mail, MapPin, Phone } from "lucide-react";

const ContactInfo = () => {
  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Informasi Kontak
        </h2>
        <p className="text-gray-600 mb-8">
          Butuh informasi lebih lanjut? Silakan kunjungi atau hubungi kami
          melalui detail di bawah ini
        </p>

        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
              <p className="text-gray-600 whitespace-pre-line">
                Jl. Ijen Boulevard No. 123\nMalang, Jawa Timur 65144
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
              <p className="text-gray-600">+62 341 123 456</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600">hello@kukubi.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Jam Operasional
              </h3>
              <p className="text-gray-600">Senin - Jumat: 09.00 - 22.00</p>
              <p className="text-gray-600">Sabtu - Minggu: 08.00 - 23.00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
