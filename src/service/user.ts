import supabase from "@/lib/supabase/client";
import { supabaseService } from "@/lib/supabase/admin";
import { IUserAdmin } from "@/types/user.types";
import { User } from "@supabase/supabase-js";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { IUserProfile } from "@/types/auth.type";

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

export const getUserData = async (
  id: string
): Promise<{ status: boolean; pesan?: string; data?: User }> => {
  const { data, error } = await supabaseService.getUserById(id);

  if (error) {
    return {
      status: false,
      pesan: "Terjadi Kesalahan",
    };
  }

  return {
    status: true,
    data: data.user,
  };
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
  const { email, id } = payload;

  const { error } = await supabaseService.updateUserById(id!, {
    email,
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

export const UpdateProfile = async (
  payload: IUserProfile
): Promise<{ status: boolean; pesan?: string }> => {
  const { id, name, bio, address, phone, avatar } = payload;

  const { error } = await supabase
    .from("users")
    .update({ name, bio, address, phone, avatar })
    .eq("id", id)
    .single();

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Terjadi Kesalahan",
    };
  }

  return {
    status: true,
    pesan: "Profile Berhasil Di Perbarui",
  };
};

export const uploadFile = async (file: File, oldImage?: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `images/avatar/${fileName}`;

  if (oldImage) {
    const oldPath = oldImage.replace(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kukubi-buckets/`,
      ""
    );
    await supabase.storage.from("kukubi-buckets").remove([oldPath]);
  }

  const { error } = await supabase.storage
    .from("kukubi-buckets")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("kukubi-buckets").getPublicUrl(filePath);

  return publicUrl;
};
