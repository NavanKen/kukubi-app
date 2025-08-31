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
import { ImageIcon, Loader2 } from "lucide-react";
import { ICreateProduk } from "@/types/produk.type";
import Image from "next/image";
import { createProduk } from "@/service/produk";
import { toast } from "sonner";

const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ICreateProduk>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        file: null as File | null,
      });
      setPreview(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error("Harap Masukkan file/gambar");
      return;
    }

    setIsLoading(true);

    const inserData = {
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      description: formData.description,
      file: formData.file,
    };

    const res = await createProduk(inserData);

    if (!res.status) {
      toast.error(res.pesan);
    }

    toast.success(res.pesan);
    setIsLoading(false);
    setOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
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
          <DialogTitle>Buat Menu Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Produk
              </label>
              <Input
                className="py-5"
                name="name"
                placeholder="Masukkan nama produk"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <Input
                className="py-5"
                type="number"
                name="price"
                placeholder="Masukkan harga"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stok</label>
              <Input
                className="py-5"
                type="number"
                name="stock"
                placeholder="Masukkan jumlah stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <Input
                className="py-5"
                name="description"
                placeholder="Masukkan deskripsi produk"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Gambar Produk
              </label>
              <div className="flex items-center gap-4">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] flex items-center justify-center rounded-md border border-dashed">
                    <ImageIcon />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
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
