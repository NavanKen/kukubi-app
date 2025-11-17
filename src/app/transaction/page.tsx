import AppLayout from "@/layout/app-layout";
import OrderMember from "@/components/member/order";

const OrderMemberPages = () => {
  return (
    <>
      <AppLayout>
        <div className="pt-32">
          <OrderMember />
        </div>
      </AppLayout>
    </>
  );
};

export default OrderMemberPages;
