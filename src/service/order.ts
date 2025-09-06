import supabase from "@/lib/supabase/client";
import { IOrders } from "@/types/orders.types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getProfileUser } from "./auth";

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

export const editPengeluaran = async (
  payload: IPengeluaran
): Promise<{ status: boolean; pesan?: string }> => {
  const { name, amount, description, date, id } = payload;

  const dateString = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`
    : null;

  const { error } = await supabase
    .from("expenses")
    .update({ name, amount, description, date: dateString })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Terjadi Kesalahan",
    };
  }
  return {
    status: true,
    pesan: "Data Berhasil Di Update",
  };
};

export const deletePengeluaran = async (
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
