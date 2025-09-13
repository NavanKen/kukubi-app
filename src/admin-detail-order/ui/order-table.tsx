import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const OrderTable = () => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant={"secondary"}>Menunggu</Badge>;
      case "done":
        return <Badge variant={"default"}>Selesai</Badge>;
    }
  };

  return (
    <div className="w-full rounded-md overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-100 dark:bg-neutral-800">
            <TableHead className="py-5">No</TableHead>
            <TableHead className="py-5">Menu</TableHead>
            <TableHead className="py-5">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="py-5 w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-neutral-50 dark:bg-neutral-900">
            <TableCell className="py-3">1</TableCell>
            <TableCell className="py-3">Dimsum Ayam</TableCell>
            <TableCell className="py-3">12.000</TableCell>
            <TableCell className="py-3">{getStatusVariant("done")}</TableCell>
            <TableCell className="py-3">Dimasak</TableCell>
          </TableRow>
          <TableRow className="bg-neutral-50 dark:bg-neutral-900">
            <TableCell className="py-3">1</TableCell>
            <TableCell className="py-3">Dimsum Ayam</TableCell>
            <TableCell className="py-3">12.000</TableCell>
            <TableCell className="py-3">
              {getStatusVariant("pending")}
            </TableCell>
            <TableCell className="py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Selesai</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 ">
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          {/* {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="bg-neutral-50 dark:bg-neutral-900">
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
            <TableRow key={index} className="bg-neutral-50 dark:bg-neutral-900">
              <TableCell className="py-3">{index + 1}</TableCell>
              <TableCell className="py-3">ORDER - {menu.id}</TableCell>
              <TableCell className="py-3">
                {menu.created_at
                  ? new Date(menu.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
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
        )} */}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
