"use client";

import OrderDetail from "@/components/member/order/order-detail";
import { useParams } from "next/navigation";

const OrderDetailPage = () => {
  const { id } = useParams();
  return <OrderDetail orderId={id as string} />;
};

export default OrderDetailPage;
