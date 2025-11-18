import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserInformation } from "@/types/user.types";
import { IOrderItem } from "@/types/order_items.type";
import { IOrders } from "@/types/orders.types";
import { updateOrderStatus, updateOrderTotalAmount } from "@/service/order";
import { toast } from "sonner";
import { useState } from "react";

interface CardInformationProps {
  user: UserInformation;
  orderItems: IOrderItem[];
  order: IOrders[];
  orderId: string;
}

const CardInformation = ({
  user,
  orderItems,
  order,
  orderId,
}: CardInformationProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const currentOrder = order[0];
  const currentStatus = currentOrder?.status || "pending";

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const allItemsReady =
    orderItems.length > 0 &&
    orderItems.every((item) => item.status === "ready");

  const handlePayment = async () => {
    if (orderItems.length === 0) {
      toast.error("Tidak ada item untuk dibayar");
      return;
    }

    setIsProcessing(true);
    try {
      const updateTotalRes = await updateOrderTotalAmount(orderId, total);
      if (!updateTotalRes.status) {
        throw new Error(updateTotalRes.pesan);
      }

      const updateStatusRes = await updateOrderStatus(orderId, "processing");
      if (!updateStatusRes.status) {
        throw new Error(updateStatusRes.pesan);
      }

      toast.success("Pembayaran berhasil! Status order: Sedang Diproses");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memproses pembayaran"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReadyToShip = async () => {
    if (!allItemsReady) {
      toast.error("Semua item harus ready sebelum diantar");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await updateOrderStatus(orderId, "shipped");
      if (!res.status) {
        throw new Error(res.pesan);
      }
      toast.success("Status order: Sedang Diantar");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal update status"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      const res = await updateOrderStatus(orderId, "completed");
      if (!res.status) {
        throw new Error(res.pesan);
      }
      toast.success("Order selesai!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal update status"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const typeLabel =
    user.type === "guest" ? "Pembelian Di Toko" : "Pembelian Online";

  const renderActionButton = () => {
    if (currentStatus === "pending") {
      return (
        <Button
          type="button"
          className="w-full"
          onClick={handlePayment}
          disabled={isProcessing || orderItems.length === 0}
        >
          {isProcessing ? "Memproses..." : "Bayar"}
        </Button>
      );
    }

    if (currentStatus === "processing") {
      return (
        <Button
          type="button"
          className="w-full"
          onClick={handleReadyToShip}
          disabled={isProcessing || !allItemsReady}
        >
          {isProcessing
            ? "Memproses..."
            : allItemsReady
            ? "Siap Diantar"
            : "Menunggu Item Ready"}
        </Button>
      );
    }

    if (currentStatus === "shipped") {
      return (
        <Button
          type="button"
          className="w-full"
          onClick={handleComplete}
          disabled={isProcessing}
        >
          {isProcessing ? "Memproses..." : "Selesai"}
        </Button>
      );
    }

    if (currentStatus === "completed") {
      return (
        <Button type="button" className="w-full" disabled variant="secondary">
          Order Selesai
        </Button>
      );
    }

    return null;
  };

  return (
    <Card className="w-full md:max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Keranjang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="customer">Kode Order</Label>
            <Input
              id="customer"
              type="text"
              placeholder="b128xjd@#"
              value={user.code}
              required
              disabled
              className="py-5"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer">Nama Pelanggan</Label>
            <Input
              id="customer"
              type="text"
              placeholder="m@example.com"
              value={user.name}
              required
              disabled
              className="py-5"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer">Jenis Order</Label>
            <Input
              id="customer"
              type="text"
              placeholder="m@example.com"
              value={typeLabel}
              required
              disabled
              className="py-5"
            />
          </div>
        </div>
        <div className="border border-t-1 border-t-gray-100 dark:border-t-zinc-700 mt-4 rounded-full" />
        <div className="mt-4">
          <CardTitle className="text-xl">Ringkasan Pemesanan</CardTitle>
          <div>
            {orderItems.length === 0 ? (
              <p className="text-sm text-muted-foreground pt-2">
                Belum ada pesanan
              </p>
            ) : (
              orderItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between pt-2 text-sm"
                >
                  <p>
                    {item.products?.name || "Produk"} x{item.quantity}
                  </p>
                  <p>
                    Rp {((item.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="border border-t-1 border-t-gray-100 dark:border-t-zinc-700 mt-4 rounded-full" />
          <div className="mt-4 flex items-center justify-between">
            <CardTitle className="text-xl">Total</CardTitle>
            <CardTitle>Rp {total.toLocaleString()}</CardTitle>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">{renderActionButton()}</CardFooter>
    </Card>
  );
};

export default CardInformation;
