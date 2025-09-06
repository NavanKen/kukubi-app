import supabase from "@/lib/supabase/client";
import { IPengeluaran } from "@/types/pengeluaran.type";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getProfileUser } from "./auth";

export const subscribePengeluaran = (
  callback: (payload: RealtimePostgresChangesPayload<IPengeluaran>) => void
) => {
  const channel = supabase
    .channel("expenses-changes")
    .on<IPengeluaran>(
      "postgres_changes",
      { event: "*", schema: "public", table: "expenses" },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getPengeluaranPaginate = async ({
  search = "",
  limit = 10,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const query = supabase
    .from("expenses")
    .select("*", { count: "exact" })
    .or(`name.ilike.%${search}%`)
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return { status: false, error };
  }

  return { status: true, data, count };
};

export const createPengeluaran = async (
  payload: IPengeluaran
): Promise<{ status: boolean; pesan?: string }> => {
  const { name, amount, description, date } = payload;

  const res = await getProfileUser();

  if (!res.status) {
    return {
      status: false,
      pesan: res.pesan,
    };
  }

  const user_id = res.data?.auth.id;
  const dateString = date?.toISOString().split("T")[0];

  const { error } = await supabase
    .from("expenses")
    .insert({ name, amount, description, user_id, date: dateString });

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
