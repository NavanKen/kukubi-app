import { useState, useEffect, useCallback } from "react";
import { subscribeOrdersItems } from "@/service/order-items";
import { getOrderById, subscribeOrderById } from "@/service/order";
import { IOrderItem } from "@/types/order_items.type";
import { IOrders } from "@/types/orders.types";
import { UserInformation } from "@/types/user.types";
import supabase from "@/lib/supabase/client";

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
    const unsub = subscribeOrdersItems(async (payload) => {
      console.log(payload.eventType);

      switch (payload.eventType) {
        case "INSERT": {
          const newItem = payload.new as IOrderItem;

          const { data } = await supabase
            .from("order_items")
            .select(
              `
            *,
            products (
              id,
              name,
              price,
              image
            )
          `
            )
            .eq("id", newItem.id)
            .single();

          if (data) {
            setOrderItems((prev) => [data as IOrderItem, ...prev]);
          }
          break;
        }

        case "UPDATE": {
          const updatedItem = payload.new as IOrderItem;
          const { data } = await supabase
            .from("order_items")
            .select(
              `
            *,
            products (
              id,
              name,
              price,
              image
            )
          `
            )
            .eq("id", updatedItem.id)
            .single();

          if (data) {
            setOrderItems((prev) =>
              prev.map((item) =>
                item.id === data.id ? (data as IOrderItem) : item
              )
            );
          }
          break;
        }

        case "DELETE": {
          const deletedId = payload.old!.id;
          setOrderItems((prev) => prev.filter((item) => item.id !== deletedId));
          break;
        }
      }
    });

    return () => unsub();
  }, [orderId]);

  useEffect(() => {
    const unsubOrder = subscribeOrderById(orderId, (payload) => {
      if (payload.eventType === "UPDATE") {
        setOrder([payload.new as IOrders]);
      }
    });

    return () => {
      unsubOrder();
    };
  }, [orderId]);

  return { orderItems, order, user, isLoading, refetch: fetchData };
};
