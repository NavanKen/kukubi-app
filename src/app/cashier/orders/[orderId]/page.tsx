"use client";

import AdminDetailOrder from "@/components/orders/admin-detail-order";
import { useParams } from "next/navigation";
import OrderDetailSkeleton from "./loading";
import NotFoundOrder from "./not-found";
import { useDetailOrder } from "@/hooks/use-detail-order";

export default function OrderDetail() {
  const { orderId } = useParams();
  const { order, orderItems, user, isLoading } = useDetailOrder(
    orderId as string
  );

  console.log("data user", user);

  if (isLoading) return <OrderDetailSkeleton />;

  if (!order || order.length === 0) return <NotFoundOrder />;

  return (
    <AdminDetailOrder
      orderId={orderId as string}
      order={order}
      orderItems={orderItems}
      user={user}
    />
  );
}
