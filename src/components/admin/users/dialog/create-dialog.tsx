"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ThemeAwareButton } from "../../ui/theme-button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IUserAdmin } from "@/types/user.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/service/user";

const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IUserAdmin>({
    name: "",
    role: "cashier",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        role: "cashier",
        email: "",
        password: "",
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const inserData = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      password: formData.password,
    };

    const res = await createUser(inserData);

    if (!res.status) {
      toast.error(res.pesan);
      setIsLoading(false);
      return;
    }

    toast.success(res.pesan);
    setIsLoading(false);
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ThemeAwareButton className="py-5 px-6">Buat</ThemeAwareButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat User Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama User
              </label>
              <Input
                className="py-5"
                name="name"
                placeholder="Masukkan Nama"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                className="py-5"
                type="email"
                name="email"
                placeholder="Masukkan Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: val as IUserAdmin["role"],
                  }))
                }
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                className="py-5"
                type="password"
                placeholder="Masukkan Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>

            <Button type="submit" disabled={isLoading ? true : false}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memuat...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
