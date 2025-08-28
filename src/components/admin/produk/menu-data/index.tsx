"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteDialog from "../dialog/delete-dialog";
import EditDialog from "../dialog/edit-dialog";
import { useEffect, useState } from "react";
import { IProduk } from "@/types/produk.type";
import { Skeleton } from "@/components/ui/skeleton";
import { getProduk } from "@/service/produk";
import Image from "next/image";

const MenuData = () => {
  const [menuData, setMenuData] = useState<IProduk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const res = await getProduk();

    if (res.status && res.data) {
      setMenuData(res.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 dark:bg-neutral-800">
                <TableHead className="py-5">No</TableHead>
                <TableHead className="py-5">Nama Menu</TableHead>
                <TableHead className="py-5">Deskripsi</TableHead>
                <TableHead className="py-5">Harga</TableHead>
                <TableHead className="py-5 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="bg-neutral-50 dark:bg-neutral-900"
                  >
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-6 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-32 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-48 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-20 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-6 py-3" />
                    </TableCell>
                  </TableRow>
                ))
              ) : menuData.length === 0 ? (
                <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                  <TableCell colSpan={5} className="text-center py-4">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                menuData.map((menu, index) => (
                  <TableRow
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-900"
                  >
                    <TableCell className="py-3">1</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={menu.image}
                          alt={menu.image}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <span>{menu.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">{menu.description}</TableCell>
                    <TableCell className="py-3">
                      Rp.
                      {menu.price}
                    </TableCell>
                    <TableCell className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <EditDialog
                              data={{
                                id: menu.id,
                                nama: menu.name,
                                deskripsi: menu.description,
                                image: menu.image,
                                price: menu.price,
                                stock: menu.stock,
                              }}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteDialog id={menu.id} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-start mt-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Limit
          </span>
          <Select>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
export default MenuData;
