import supabase from "@/lib/supabase/client";
import { ILogin, IRegister, IUserResponse } from "@/types/auth.type";

export const login = async (payload: ILogin) => {
  const { email, password } = payload;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: null,
      pesan: error?.message,
    };
  }

  return {
    status: true,
    data: data,
  };
};

export const register = async (payload: IRegister) => {
  const { email, password, confirm_password } = payload;

  if (password !== confirm_password) {
    return {
      status: null,
      pesan: "Password atau Konfirmasi Password tidak sesuai !",
    };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      status: null,
      pesan: error?.message,
    };
  }
  return {
    status: true,
    data: data,
  };
};

export const getProfileUser = async (): Promise<IUserResponse> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return {
      status: null,
      pesan: error?.message,
    };
  }

  const userId: string = data.user?.id || "";

  const { data: UserProfile, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    return {
      status: null,
      pesan: userError?.message,
    };
  }

  const authData = data.user;
  const userProfileData = UserProfile;

  return {
    status: true,
    data: {
      auth: authData,
      profile: userProfileData,
    },
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      status: null,
      pesan: error?.message,
    };
  }

  return {
    status: true,
    pesan: "Berhasil Keluar",
  };
};
