import supabase from "@/lib/supabase/client";
import type { ICreateOrderItem, IOrderItem } from "@/types/order_items.type";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const subscribeOrdersItems = (
  orderId: string,
  callback: (payload: RealtimePostgresChangesPayload<IOrderItem>) => void
) => {
  const channel = supabase
    .channel(`order-items-${orderId}`)
    .on<IOrderItem>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "order_items",
        filter: `order_id=eq.${orderId}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const createOrderItems = async (
  orderItems: ICreateOrderItem[]
): Promise<{ status: boolean; pesan?: string; data?: IOrderItem[] }> => {
  const { data, error } = await supabase
    .from("order_items")
    .insert(orderItems)
    .select();

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal membuat order items",
    };
  }

  return {
    status: true,
    pesan: "Order items berhasil dibuat",
    data: data as IOrderItem[],
  };
};

export const getOrderItemsByOrderId = async (
  orderId: number
): Promise<{ status: boolean; pesan?: string; data?: IOrderItem[] }> => {
  const { data, error } = await supabase
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
    .eq("order_id", orderId);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal mengambil order items",
    };
  }

  return {
    status: true,
    data: data as IOrderItem[],
  };
};

export const updateOrderItemQuantity = async (
  id: number,
  quantity: number
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase
    .from("order_items")
    .update({ quantity })
    .eq("id", id);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal update quantity",
    };
  }

  return {
    status: true,
    pesan: "Quantity berhasil diupdate",
  };
};

export const deleteOrderItem = async (
  id: number
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase.from("order_items").delete().eq("id", id);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal menghapus order item",
    };
  }

  return {
    status: true,
    pesan: "Order item berhasil dihapus",
  };
};
