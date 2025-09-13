"use client";

import AdminDetailOrder from "@/components/orders/admin-detail-order";
import { useParams } from "next/navigation";

export default function OrderDetail() {
  const { orderId } = useParams();

  return <AdminDetailOrder orderId={orderId as string} />;
}
