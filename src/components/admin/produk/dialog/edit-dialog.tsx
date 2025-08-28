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
import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { editProduk, uploadImage } from "@/service/produk";
import { toast } from "sonner";

interface EditDialogProps {
  data: {
    id: string;
    nama: string;
    deskripsi: string;
    price: number;
    stock: number;
    image: string;
  };
}

const EditDialog = ({ data }: EditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: data.nama || "",
    price: data.price || 0,
    stock: data.stock || 0,
    deskripsi: data.deskripsi || "",
    image: data.image || "",
    file: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(data.image || null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = formData.image;

    if (formData.file) {
      try {
        imageUrl = await uploadImage(formData.file, data.image);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Upload gagal:", err.message);
        } else {
          toast.error("Upload Gagal");
        }
        return;
      }
    }

    const id = data.id;
    const name = formData.nama;
    const description = formData.deskripsi;
    const stock = formData.stock;
    const price = formData.stock;
    const image = imageUrl;

    const insertData = {
      id,
      name,
      description,
      price,
      stock,
      image,
    };

    const res = await editProduk(insertData);

    if (!res.status) {
      toast.error("Gagal edit data");
    }

    toast.success(res.pesan);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>Edit produk menu</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Produk
              </label>
              <Input
                className="py-5"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <Input
                className="py-5"
                type="number"
                name="price"
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
                name="deskripsi"
                value={formData.deskripsi}
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
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
