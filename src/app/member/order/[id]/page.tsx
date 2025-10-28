import OrderDetail from "@/components/member/order/order-detail";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const OrderDetailPage = ({ params }: OrderDetailPageProps) => {
  return <OrderDetail orderId={params.id} />;
};

export default OrderDetailPage;
