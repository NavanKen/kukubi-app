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
import { useState } from "react";
import { ThemeAwareButton } from "../../ui/theme-button";

const CreateDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ThemeAwareButton className="py-5 px-6">Buat</ThemeAwareButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Menu Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Nama Menu" />
          <Input placeholder="Deskripsi" />
          <Input type="number" placeholder="Harga" />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
