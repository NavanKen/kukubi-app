"use client";

import { useEffect } from "react";
import { ThemeAwareButton } from "@/components/admin/ui/theme-button";
import CardInformation from "./ui/customer-information";
import OrderTable from "./ui/order-table";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/use-role";
// import { IOrders } from "@/types/orders.types";
import { IOrderItem } from "@/types/order_items.type";
import { UserInformation } from "@/types/user.types";

type AdminDetailOrderProps = {
  orderId: string;
  // order: IOrders[];
  orderItems: IOrderItem[];
  user: UserInformation | null;
};

const AdminDetailOrder = ({
  orderId,
  // order,
  orderItems,
  user,
}: AdminDetailOrderProps) => {
  const router = useRouter();
  const role = useUserRole();

  useEffect(() => {
    console.log(orderId);
  }, [orderId]);

  const addRoute = async () => {
    if (role === "cashier") {
      router.push(`/cashier/orders/${orderId}/add`);
    } else {
      router.push(`/admin/orders/${orderId}/add`);
    }
  };

  return (
    <>
      <div>
        <div className="flex md:flex-row flex-col md:items-center gap-3 justify-between mb-5">
          <h1 className="text-3xl font-bold">Detail Order - {orderId}</h1>
          <ThemeAwareButton onClick={addRoute} className="cursor-pointer">
            Tambah Pemesanan
          </ThemeAwareButton>
        </div>
        <div className="flex md:flex-row flex-col gap-3 justify-between">
          <div className="w-full">
            <OrderTable orderItems={orderItems!} />
          </div>
          <CardInformation user={user!} />
        </div>
      </div>
    </>
  );
};

export default AdminDetailOrder;
