"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader2 } from "lucide-react";
import { ForgotPassword } from "@/service/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [credential, setCredential] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const email = credential.email;

    const response = await ForgotPassword(email);

    if (!response.status || response.status === null) {
      setIsLoading(false);
      toast.error(response.pesan || "Terjadi Kesalahan");
      return;
    }

    setIsLoading(false);
    toast.success(response.pesan);
    router.push("/auth/login");
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center px-3">
        <div className="flex rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2">
            <KeyRound className="text-white" size={28} />
          </div>
          <div className="bg-stone-100 shadow-2xl p-6">
            <div className="text-center space-y-2 mb-5">
              <h1 className="font-bold text-2xl">Lupa Password</h1>
              <p className="text-gray-600 text-sm max-w-[300px]">
                Masukkan email Anda dan Kami akan mengirimkan link untuk reset
                password anda melalui email
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4 mb-5">
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
                  "Reset Sekarang"
                )}
              </Button>
            </form>
            <div className="text-center text-sm font-semibold mt-5">
              <span className="text-gray-600">
                Sudah punya akun ?{" "}
                <Link
                  className="text-orange-600 hover:text-orange-700"
                  href={"/auth/login"}
                >
                  Masuk Sekarang
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
