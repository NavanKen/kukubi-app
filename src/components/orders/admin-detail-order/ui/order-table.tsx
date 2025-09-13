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
import { IOrderItem } from "@/types/order_items.type";
import Image from "next/image";

const OrderTable = ({ orderItems }: { orderItems: IOrderItem[] }) => {
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
                  <span>{item.products?.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-3">{item.products?.price}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
