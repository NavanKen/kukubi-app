import supabase from "@/lib/supabase/client";
import { supabaseService } from "@/lib/supabase/admin";
import { IUserAdmin } from "@/types/user.types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const subscribeUser = (
  callback: (payload: RealtimePostgresChangesPayload<IUserAdmin>) => void
) => {
  const channel = supabase
    .channel("user-changes")
    .on<IUserAdmin>(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getUserPaginate = async ({
  search = "",
  limit = 10,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const query = supabase
    .from("users")
    .select("*", { count: "exact" })
    .or(`name.ilike.%${search}%,role.ilike.%${search}%`)
    .in("role", ["admin", "cashier"])
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return { status: false, error };
  }

  return { status: true, data, count };
};

export const createUser = async (
  payload: IUserAdmin
): Promise<{ status: boolean; pesan?: string }> => {
  const { name, email, password, role } = payload;

  const { data, error: authError } = await supabaseService.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return {
      status: false,
      pesan: authError?.message,
    };
  }

  const id = data.user.id;
  const bio = "Welcome to Kukubi";

  const { error } = await supabase
    .from("users")
    .insert({ id, name, role, bio });

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

export const editUser = async (
  payload: IUserAdmin
): Promise<{ status: boolean; pesan?: string }> => {
  const { name, role, id } = payload;

  const { error } = await supabase
    .from("users")
    .update({ name, role })
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

export const editAuthUser = async (
  payload: IUserAdmin
): Promise<{ status: boolean; pesan?: string }> => {
  const { email, password, id } = payload;

  const { error } = await supabaseService.updateUserById(id!, {
    email,
    password,
  });

  if (error) {
    return {
      status: false,
      pesan: error?.message,
    };
  }

  return {
    status: true,
    pesan: "Data Berhasil Di Update",
  };
};

export const deleteUser = async (
  id: string
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase.from("users").delete().eq("id", id);

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

export const deleteAuthUser = async (
  id: string
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabaseService.deleteUser(id);

  if (error) {
    return {
      status: false,
      pesan: error?.message,
    };
  }
  return {
    status: true,
    pesan: "Data berhasil dihapus",
  };
};
