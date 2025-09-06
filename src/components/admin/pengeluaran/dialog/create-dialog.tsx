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
import { IPengeluaran } from "@/types/pengeluaran.type";
import { createPengeluaran } from "@/service/pengeluaran";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<IPengeluaran>({
    name: "",
    amount: 0,
    description: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        amount: 0,
        description: "",
      });
      setDate(new Date());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) {
      toast.error("Masukkan input yang kosong");
      return;
    }

    setIsLoading(true);

    const insertData = {
      name: formData.name,
      amount: formData.amount,
      description: formData.description,
      date: date,
    };

    const res = await createPengeluaran(insertData);

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
          <DialogTitle>Buat Pengeluaran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Pengeluaran
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
              <label className="block text-sm font-medium mb-1">
                Deskripsi Pengeluaran
              </label>
              <Input
                className="py-5"
                type="text"
                name="description"
                placeholder="Masukkan Deskripsi Pengeluaran"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Pengeluaran
              </label>
              <Input
                className="py-5"
                type="number"
                placeholder="Masukkan total pengeluaran"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">
                Tanggal
              </Label>
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between font-normal py-5"
                  >
                    {date
                      ? date.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Pilih Tanggal"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setOpenDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
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
