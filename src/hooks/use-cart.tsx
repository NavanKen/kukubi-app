import { useCallback, useEffect, useState } from "react";
import { ICart } from "@/types/cart.type";
import { getCartByUserId, subscribeCart } from "@/service/cart";
import supabase from "@/lib/supabase/client";

export const useCart = (userId: string) => {
  const [cartData, setCartData] = useState<ICart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const res = await getCartByUserId(userId);

    if (res.status && res.data) {
      setCartData(res.data);
      calculateTotal(res.data);
    }

    setIsLoading(false);
  }, [userId]);

  const calculateTotal = (data: ICart[]) => {
    const totalAmount = data.reduce((sum, item) => {
      const price = item.products?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!userId) return;

    const unsub = subscribeCart(async (payload) => {
      console.log("Payload", payload.eventType);
      switch (payload.eventType) {
        case "INSERT": {
          const newItem = payload.new as ICart;

          const { data } = await supabase
            .from("carts")
            .select(
              `
              *,
              products (
                id,
                name,
                price,
                image,
                stock
              )
            `
            )
            .eq("id", newItem.id)
            .single();

          if (data) {
            const newCart = data as ICart;
            setCartData((prev) => {
              const exists = prev.find((item) => item.id === newCart.id);
              if (exists) {
                return prev;
              }
              const updated = [newCart, ...prev];
              calculateTotal(updated);
              return updated;
            });
          }
          break;
        }

        case "UPDATE": {
          const updatedItem = payload.new as ICart;
          const { data } = await supabase
            .from("carts")
            .select(
              `
              *,
              products (
                id,
                name,
                price,
                image,
                stock
              )
            `
            )
            .eq("id", updatedItem.id)
            .single();

          if (data) {
            setCartData((prev) => {
              const updated = prev.map((item) =>
                item.id === data.id ? (data as ICart) : item
              );
              calculateTotal(updated);
              return updated;
            });
          }
          break;
        }

        case "DELETE": {
          const deletedId = payload.old!.id;
          setCartData((prev) => {
            const updated = prev.filter((item) => item.id !== deletedId);
            calculateTotal(updated);
            return updated;
          });
          break;
        }
      }
    });

    return () => unsub();
  }, [userId]);

  return { cartData, isLoading, total, refetch: fetchData };
};
