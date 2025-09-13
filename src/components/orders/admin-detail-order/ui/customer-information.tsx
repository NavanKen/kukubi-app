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

const CardInformation = ({ user }: { user: UserInformation }) => {
  return (
    <Card className="w-full md:max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Keranjang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
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
              value={"Pembelian di Toko"}
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
            <div className="flex items-center justify-between pt-2 text-sm">
              <p>dimsum Ayam</p>
              <p>Rp 12.000</p>
            </div>
            <div className="flex items-center justify-between pt-2 text-sm">
              <p>dimsum Ayam</p>
              <p>Rp 12.000</p>
            </div>
          </div>
          <div className="border border-t-1 border-t-gray-100 dark:border-t-zinc-700 mt-4 rounded-full" />
          <div className="mt-4 flex items-center justify-between">
            <CardTitle className="text-xl">Total</CardTitle>
            <CardTitle>Rp 24.000</CardTitle>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Bayar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardInformation;
