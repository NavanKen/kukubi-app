"use client";

interface IPassword {
  password: boolean;
  confirm_password: boolean;
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { register } from "@/service/auth";
import { IRegister } from "@/types/auth.type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const RegisterPage = () => {
  const [credential, setCredential] = useState<IRegister>({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visiBility, setVisibility] = useState<IPassword>({
    password: true,
    confirm_password: true,
  });

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credential.email || !credential.password) {
      toast.error("Harap Isi Field yang Kosong");
      return;
    }

    setIsLoading(true);
    const email = credential.email;
    const password = credential.password;
    const confirm_password = credential.confirm_password;

    const response = await register({ email, password, confirm_password });

    if (!response.status || response.status === null) {
      setIsLoading(false);
      toast.error(response.pesan || "Gagal untuk Register");
      return;
    }

    setIsLoading(false);
    router.push("/auth/register/success");
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
              <h1 className="font-bold text-2xl">Update Password</h1>
              <p className="text-gray-600 text-sm max-w-[300px]">
                Silahkan memperbarui password baru anda untuk melanjutkan
              </p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4 mb-5">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={visiBility.password ? "password" : "text"}
                    placeholder="Masukkan password"
                    onChange={(e) =>
                      setCredential({ ...credential, password: e.target.value })
                    }
                    value={credential.password}
                    className="h-12"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVisibility((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {visiBility.password ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={visiBility.confirm_password ? "password" : "text"}
                    placeholder="Masukkan konfirmasi password"
                    onChange={(e) =>
                      setCredential({
                        ...credential,
                        confirm_password: e.target.value,
                      })
                    }
                    value={credential.confirm_password}
                    className="h-12"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVisibility((prev) => ({
                        ...prev,
                        confirm_password: !prev.confirm_password,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {visiBility.confirm_password ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
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
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
