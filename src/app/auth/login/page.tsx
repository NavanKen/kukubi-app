"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { getProfileUser, login } from "@/service/auth";
import { ILogin } from "@/types/auth.type";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [credential, setCredential] = useState<ILogin>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visiBility, setVisibility] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credential.email || !credential.password) {
      toast.error("Harap Isi Field yang Kosong");
      return;
    }

    setIsLoading(true);
    const email = credential.email;
    const password = credential.password;

    const response = await login({ email, password });

    if (!response.status || response.status === null) {
      setIsLoading(false);
      toast.error(response.pesan || "Gagal untuk login");
      return;
    }

    setIsLoading(false);
    toast.success("Berhasil Login");

    const user = await getProfileUser();
    const role = user.data?.profile.role;

    if (callbackUrl) {
      router.push(callbackUrl);
      return;
    }

    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "cashier":
        router.push("/cashier/dashboard");
        break;
      default:
        router.push("/member/dashboard");
        break;
    }
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4">
            <User className="text-white" size={28} />
          </div>
          <div className="bg-stone-100 shadow-2xl p-6">
            <div className="text-center space-y-2 mb-5">
              <h1 className="font-bold text-2xl">Selamat Datang</h1>
              <p className="text-gray-600 text-sm">
                Masukkan email dan password anda untuk melanjutkan
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 mb-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="h-12"
                  onChange={(e) =>
                    setCredential({ ...credential, email: e.target.value })
                  }
                  value={credential.email}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={visiBility ? "password" : "text"}
                    placeholder="Masukkan password"
                    onChange={(e) =>
                      setCredential({ ...credential, password: e.target.value })
                    }
                    value={credential.password}
                    className="h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibility(!visiBility)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {visiBility ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Ingat saya
                  </Label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading ? true : false}
                className="w-full py-2.5 h-10 bg-orange-600 hover:bg-orange-700 text-white cursor-pointer rounded-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-stone-100 px-2 text-gray-500">Atau</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Masuk dengan Google
            </Button>

            <div className="text-center text-sm font-semibold mt-5">
              <span className="text-gray-600">
                Belum punya akun ?{" "}
                <Link
                  className="text-orange-600 hover:text-orange-700"
                  href={"/auth/register"}
                >
                  Daftar Sekarang
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
