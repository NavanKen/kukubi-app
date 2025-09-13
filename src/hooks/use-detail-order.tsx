import { useState, useEffect, useCallback } from "react";
import { subscribeOrdersItems } from "@/service/order-items";
import { getOrderById } from "@/service/order";
import { IOrderItem } from "@/types/order_items.type";
import { IOrders } from "@/types/orders.types";
import { UserInformation } from "@/types/user.types";

export const useDetailOrder = (orderId: string) => {
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [order, setOrder] = useState<IOrders[]>([]);
  const [user, setUser] = useState<UserInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getOrderById(orderId);

    if (res.status) {
      setOrderItems(res.order_items || []);
      setOrder(res.order || []);
      setUser(res.user || null);
    }

    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsub = subscribeOrdersItems(orderId, (payload) => {
      switch (payload.eventType) {
        case "INSERT":
          setOrderItems((prev) => [payload.new!, ...prev]);
          break;
        case "UPDATE":
          setOrderItems((prev) =>
            prev.map((item) =>
              item.id === payload.new?.id ? payload.new : item
            )
          );
          break;
        case "DELETE":
          setOrderItems((prev) =>
            prev.filter((item) => item.id !== payload.old?.id)
          );
          break;
      }
    });

    return () => {
      unsub().catch(console.error);
    };
  }, [orderId]);

  return { orderItems, order, user, isLoading, refetch: fetchData };
};
