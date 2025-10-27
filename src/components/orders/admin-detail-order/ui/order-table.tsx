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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IOrderItem } from "@/types/order_items.type";
import Image from "next/image";
import { deleteOrderItem, updateOrderItemStatus } from "@/service/order-items";
import { updateProductStock } from "@/service/produk";
import { toast } from "sonner";
import { useState } from "react";

const OrderTable = ({
  orderItems,
  currentStatus,
}: {
  orderItems: IOrderItem[];
  currentStatus: string;
}) => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    productId: number;
    quantity: number;
    name: string;
  } | null>(null);

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "pending":
        return <Badge variant={"secondary"}>Menunggu</Badge>;
      case "ready":
        return <Badge variant={"default"}>Siap</Badge>;
      default:
        return <Badge variant={"secondary"}>Menunggu</Badge>;
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "pending" | "ready"
  ) => {
    setUpdatingId(id);
    const res = await updateOrderItemStatus(id, status);

    if (!res.status) {
      toast.error(res.pesan || "Gagal update status");
    } else {
      toast.success(res.pesan);
    }
    setUpdatingId(null);
  };

  const openDeleteDialog = (
    id: number,
    productId: number,
    quantity: number,
    name: string
  ) => {
    setItemToDelete({ id, productId, quantity, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const { id, productId, quantity } = itemToDelete;

    const res = await deleteOrderItem(id);

    if (!res.status) {
      toast.error(res.pesan || "Gagal menghapus item");
      setDeleteDialogOpen(false);
      return;
    }

    const stockRes = await updateProductStock(productId, quantity);

    if (!stockRes.status) {
      console.error("Gagal restore stock:", stockRes.pesan);
      toast.warning("Item dihapus tapi stock gagal dikembalikan");
    } else {
      toast.success("Item dihapus dan stock dikembalikan");
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
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
          {orderItems.map((item, index) => (
            <TableRow key={index} className="bg-neutral-50 dark:bg-neutral-900">
              <TableCell className="py-3">{index + 1}</TableCell>
              <TableCell className="py-3">
                <div className="flex items-center lg:gap-3 flex-col lg:flex-row">
                  <Image
                    src={item.products?.image || "/placeholder.png"}
                    alt={item.products?.name || "Product image"}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <span>
                    {item.products?.name} x{item.quantity}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3">{item.products?.price}</TableCell>
              <TableCell className="py-3">
                {getStatusVariant(item.status)}
              </TableCell>
              <TableCell className="py-3">
                {(currentStatus === "pending" ||
                  currentStatus === "processing") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={updatingId === item.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.status !== "ready" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(item.id!, "ready")}
                          disabled={!item.id}
                        >
                          Tandai Siap
                        </DropdownMenuItem>
                      )}
                      {item.status === "ready" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(item.id!, "pending")
                          }
                          disabled={!item.id}
                        >
                          Tandai Menunggu
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() =>
                          openDeleteDialog(
                            item.id!,
                            item.product_id,
                            item.quantity,
                            item.products?.name || "Item"
                          )
                        }
                        disabled={!item.id}
                      >
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Item Order</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold">{itemToDelete?.name}</span> dari
              order ini? Stock produk akan dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderTable;
