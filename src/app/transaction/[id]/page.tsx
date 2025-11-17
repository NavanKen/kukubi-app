"use client";

import AppLayout from "@/layout/app-layout";
import OrderDetail from "@/components/member/order/order-detail";
import { useParams } from "next/navigation";

const OrderMemberPages = () => {
  const { id } = useParams();

  return (
    <>
      <AppLayout>
        <div className="pt-32">
          <OrderDetail orderId={id as string} />
        </div>
      </AppLayout>
    </>
  );
};

export default OrderMemberPages;
