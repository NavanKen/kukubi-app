import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

const RegisterSuccessPage = () => {
  return (
    <>
      <div className="md:px-0 px-4 flex items-center justify-center w-full h-screen">
        <div className="shadow-xl border-2 border-gray-200 rounded-2xl w-full max-w-xl p-4">
          <div className="space-y-1 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Registrasi Berhasil!
            </h2>
            <p className="text-center text-gray-600">
              Akun Anda telah berhasil dibuat
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <Mail className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cek Email Anda
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kami telah mengirimkan email aktivasi ke alamat email yang
                  Anda daftarkan. Silakan cek inbox atau folder spam Anda dan
                  klik link aktivasi untuk mengaktifkan akun.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white cursor-pointer rounded-lg"
                >
                  Kembali Ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSuccessPage;
