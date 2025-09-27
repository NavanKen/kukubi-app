"use client";

import AddOrder from "@/components/orders/admin-detail-order/add";
import { useDetailOrder } from "@/hooks/use-detail-order";
import { useParams } from "next/navigation";
import OrderDetailSkeleton from "../loading";
import NotFoundOrder from "../not-found";

export default function AddOrderPages() {
  const { orderId } = useParams();
  const { order, user, isLoading } = useDetailOrder(orderId as string);

  console.log("data user", user);

  if (isLoading) return <OrderDetailSkeleton />;

  if (!order || order.length === 0) return <NotFoundOrder />;
  return <AddOrder orderId={orderId as string} />;
}
