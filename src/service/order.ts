import supabase from "@/lib/supabase/client";
import { IOrderItem } from "@/types/order_items.type";
import { IOrders } from "@/types/orders.types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { UserInformation } from "@/types/user.types";

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

export const createOrder = async (
  customer_name: string
): Promise<{ status: boolean; pesan?: string }> => {
  //   const user_id = res.data?.auth.id;
  const today = new Date();
  const created_at = today.toISOString().split("T")[0];
  const order_type = "offline";
  const status = "pending";
  const total_amount = 0;

  const { error } = await supabase
    .from("orders")
    .insert({ customer_name, order_type, status, created_at, total_amount });

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

export const detailOrder = async (
  payload: IOrders
): Promise<{ status: boolean; pesan?: string }> => {
  const {
    customer_name,
    order_type,
    status,
    total_amount,
    updated_at,
    guest_identifier,
    user_id,
  } = payload;

  // const dateString = date
  //   ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  //       2,
  //       "0"
  //     )}-${String(date.getDate()).padStart(2, "0")}`
  //   : null;

  // const { error } = await supabase
  //   .from("expenses")
  //   .update({ name, amount, description, date: dateString })
  //   .eq("id", id)
  //   .select()
  //   .single();

  // if (error) {
  //   return {
  //     status: false,
  //     pesan: error?.message || "Terjadi Kesalahan",
  //   };
  // }
  return {
    status: true,
    pesan: "Data Berhasil Di Update",
  };
};

export const deleteOrder = async (
  id: string
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

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
