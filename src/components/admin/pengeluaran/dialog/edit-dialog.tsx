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
import { ChevronDownIcon, EditIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IEditPengeluaran } from "@/types/pengeluaran.type";
import { editPengeluaran } from "@/service/pengeluaran";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@radix-ui/react-dropdown-menu";

const EditDialog = ({ data }: IEditPengeluaran) => {
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    data.date ? new Date(`${data.date}T00:00:00`) : undefined
  );
  const [formData, setFormData] = useState({
    name: data.name!,
    amount: data.amount!,
    description: data.description!,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        name: data.name!,
        amount: data.amount!,
        description: data.description!,
      });
      setDate(data.date ? new Date(`${data.date}T00:00:00`) : undefined);
    }
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

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      toast.error("Masukkan input yang kosong");
      return;
    }
    setIsLoading(true);

    const id = data.id;
    const name = formData.name;
    const amount = formData.amount;
    const description = formData.description;

    const insertData = {
      id,
      name,
      amount,
      description,
      date,
    };

    const res = await editPengeluaran(insertData);

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
                value={formData.description || ""}
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
              <Label className="px-1">Tanggal</Label>
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
