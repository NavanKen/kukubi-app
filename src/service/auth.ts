import supabase from "@/lib/supabase/client";
import { ILogin, IRegister } from "@/types/auth.type";

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

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return {
      status: "error",
      pesan: error?.message,
    };
  }

  return {
    status: "success",
    data: data.user,
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
