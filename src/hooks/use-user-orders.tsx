import { useCallback, useEffect, useState } from "react";
import { IOrders } from "@/types/orders.types";
import supabase from "@/lib/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useUserOrders = (userId: string) => {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as IOrders[]);
    }

    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user-orders-${userId}`)
      .on<IOrders>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<IOrders>) => {
          switch (payload.eventType) {
            case "INSERT": {
              const newOrder = payload.new as IOrders;
              setOrders((prev) => [newOrder, ...prev]);
              break;
            }

            case "UPDATE": {
              const updated = payload.new as IOrders;
              setOrders((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item))
              );
              break;
            }

            case "DELETE": {
              const deleted = payload.old as IOrders;
              setOrders((prev) => prev.filter((item) => item.id !== deleted.id));
              break;
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { orders, isLoading, refetch: fetchData };
};
