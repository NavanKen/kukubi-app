"use client";

interface MenuDataProps {
  search: string;
  limit: number;
  page: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteDialog from "../dialog/delete-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { EditIcon } from "lucide-react";
import Link from "next/link";

const MenuData = ({
  search,
  limit,
  page,
  onPageChange,
  onLimitChange,
}: MenuDataProps) => {
  const { menuData, isLoading, total } = useOrders(search, limit, page);
  const totalPages = Math.ceil(total / limit);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-200 text-amber-900 border border-amber-400 font-semibold">
            Menunggu
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-200 text-blue-900 border border-blue-400 font-semibold">
            Sedang Diproses
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-200 text-purple-900 border border-purple-400 font-semibold">
            Dalam Pengiriman
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-emerald-200 text-emerald-900 border border-emerald-400 font-semibold">
            Selesai
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-200 text-rose-900 border border-rose-400 font-semibold">
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <div className="">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 dark:bg-neutral-800">
                <TableHead className="py-5">No</TableHead>
                <TableHead className="py-5">Order Id</TableHead>
                <TableHead className="py-5">Tanggal Order</TableHead>
                <TableHead>Nama Pelanggan</TableHead>
                <TableHead className="py-5">Jenis Order</TableHead>
                <TableHead className="py-5">Status</TableHead>
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
                      <Skeleton className="h-4 w-20 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-20 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-20 py-3" />
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
                  <TableCell colSpan={7} className="text-center py-4">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                menuData.map((menu, index) => (
                  <TableRow
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-900"
                  >
                    <TableCell className="py-3">{index + 1}</TableCell>
                    <TableCell className="py-3">ORDER - {menu.id}</TableCell>
                    <TableCell className="py-3">
                      {menu.created_at
                        ? new Date(menu.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Tanggal belum di set"}
                    </TableCell>
                    <TableCell className="py-3">{menu.customer_name}</TableCell>
                    <TableCell className="py-3">
                      {menu.order_type === "online" ? (
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                          Pesan Online
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                          Pembelian di Toko
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(menu.status)}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-3">
                        <Link href={`/admin/orders/edit/${menu.id}`}>
                          <EditIcon className="w-5 h-5 cursor-pointer" />
                        </Link>
                        <DeleteDialog id={menu.id!} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center gap-2 justify-between mt-4 pb-7">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Limit
            </span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
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

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};
export default MenuData;
