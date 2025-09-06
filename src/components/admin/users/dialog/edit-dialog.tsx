"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { EditIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IEditUserAdmin, IUserAdmin } from "@/types/user.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editAuthUser, editUser, getUserData } from "@/service/user";

const EditDialog = ({ data }: IEditUserAdmin) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: data.id || "",
    nama: data.name || "",
    role: data.role,
  });
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const res = await getUserData(data.id!);
      setCredential({
        email: res.data?.email || "",
        password: "",
      });
      if (open) {
        setFormData({
          id: data.id || "",
          nama: data.name || "",
          role: data.role,
        });
      }
    };

    loadData();
  }, [open, data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeCredential = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCredential((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const id = data.id || "";
    const name = formData.nama;
    const role = formData.role;
    const email = credential.email;
    const password = credential.password;

    if (!password) {
      toast.error("Masukkan password baru jika ingin edit user");
      setIsLoading(false);
      return;
    }

    const insertData = {
      id,
      name,
      role,
    };

    const insertAuthData = {
      id,
      email,
      password,
    };

    const resAuth = await editAuthUser(insertAuthData);

    if (!resAuth.status) {
      toast.error(resAuth.pesan);
      setIsLoading(false);
    }

    const res = await editUser(insertData);

    if (!res.status) {
      toast.error("Gagal edit data");
      setIsLoading(false);
    }

    toast.success(res.pesan);
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditIcon className="w-5 h-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit data User</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama User
              </label>
              <Input
                className="py-5"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                className="py-5"
                type="email"
                name="email"
                value={credential.email}
                onChange={handleChangeCredential}
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
                name="password"
                value={credential.password}
                placeholder="Masukkan Password Baru"
                onChange={handleChangeCredential}
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
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
