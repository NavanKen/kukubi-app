import supabase from "@/lib/supabase/client";
import { IOrderItem } from "@/types/order_items.type";
import { IOrders } from "@/types/orders.types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { UserInformation } from "@/types/user.types";

export interface ICreateGuestItem {
  customer_name: string;
  guest_identifier: string;
}

export const subscribeOrder = (
  callback: (payload: RealtimePostgresChangesPayload<IOrders>) => void
) => {
  const channel = supabase
    .channel("orders-changes")
    .on<IOrders>(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeOrderById = (
  orderId: string,
  callback: (payload: RealtimePostgresChangesPayload<IOrders>) => void
) => {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on<IOrders>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getOrderPaginate = async ({
  search = "",
  limit = 10,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .or(`customer_name.ilike.%${search}%`)
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return { status: false, error };
  }

  return { status: true, data, count };
};

export const createGuestOrder = async ({
  customer_name,
  guest_identifier,
}: ICreateGuestItem): Promise<{ status: boolean; pesan?: string }> => {
  //   const user_id = res.data?.auth.id;
  const today = new Date();
  const created_at = today.toISOString().split("T")[0];
  const order_type = "offline";
  const status = "pending";
  const total_amount = 0;

  const { error } = await supabase.from("orders").insert({
    customer_name,
    guest_identifier,
    order_type,
    status,
    created_at,
    total_amount,
  });

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal update data",
    };
  }

  return {
    status: true,
    pesan: "Data berhasil ditambahkan",
  };
};

export const createUserOrder = async () => {};

export const getOrderById = async (
  id: string
): Promise<{
  status: boolean;
  pesan?: string;
  order?: IOrders[];
  order_items?: IOrderItem[];
  user?: UserInformation;
}> => {
  let userInformation: UserInformation = { name: "Unknown", type: "guest" };
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id);

  if (error) {
    return {
      status: false,
      pesan: error?.message,
    };
  }

  const { data: userInfo, error: userError } = await supabase
    .from("orders")
    .select("users (name), guest_identifier, customer_name")
    .eq("id", id)
    .single();

  if (userError) {
    return {
      status: false,
      pesan: userError?.message,
    };
  }

  if (userInfo.guest_identifier) {
    userInformation = {
      name: userInfo.customer_name,
      type: "guest",
    };
  } else {
    userInformation = {
      name: userInfo.users?.[0]?.name ?? "Unknown",
      type: "registered",
    };
  }

  const { data: orderItems, error: errorGetData } = await supabase
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
    .eq("order_id", id);

  if (errorGetData) {
    return {
      status: false,
      pesan: errorGetData?.message,
    };
  }

  return {
    status: true,
    order: data as IOrders[],
    order_items: orderItems as IOrderItem[],
    user: userInformation,
  };
};

export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled"
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal update status order",
    };
  }

  return {
    status: true,
    pesan: "Status order berhasil diupdate",
  };
};

export const updateOrderTotalAmount = async (
  orderId: string,
  totalAmount: number
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase
    .from("orders")
    .update({ total_amount: totalAmount })
    .eq("id", orderId);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal update total amount",
    };
  }

  return {
    status: true,
    pesan: "Total amount berhasil diupdate",
  };
};

export const deleteOrder = async (
  id: string
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  const { error: OrderItemsError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", id);

  if (OrderItemsError) {
    return {
      status: false,
      pesan: OrderItemsError?.message || "Terjadi Kesalahan",
    };
  }

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Terjadi Kesalahan",
    };
  }

  return {
    status: true,
    pesan: "Data Berhasil Dihapus",
  };
};
