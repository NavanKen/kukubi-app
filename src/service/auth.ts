import { ILogin, IRegister, IUserResponse } from "@/types/auth.type";
import { api } from "@/config/api";
import axios from "axios";
import { supabaseService } from "@/lib/supabase/admin";
import { ApiEndpoint } from "@/config/endpoint";

export const login = async (payload: ILogin) => {
  try {
    const response = await api.post(ApiEndpoint.Login, payload);
    return response.data;
  } catch (error) {
    console.error("Login service error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }

    return {
      status: false,
      pesan: "Network error",
    };
  }
};

export const register = async (payload: IRegister) => {
  try {
    const response = await api.post(ApiEndpoint.Register, payload);
    return response.data;
  } catch (error) {
    console.error("Register service error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }

    return {
      status: false,
      pesan: "Network error",
    };
  }
};

export const getProfileUser = async (): Promise<IUserResponse> => {
  try {
    const response = await api.get(ApiEndpoint.Profile);
    return response.data;
  } catch (error) {
    console.error("Get profile service error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }

    return {
      status: null,
      pesan: "Network error",
    };
  }
};

export const logout = async () => {
  try {
    const response = await api.post(ApiEndpoint.Logout);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      status: false,
      pesan: "Network error",
    };
  }
};

export const ForgotPassword = async (email: string) => {
  const { data } = await supabaseService.listUsers();
  const userEmail = email;

  const user = data.users.find((u) => u.email === userEmail);

  if (!user) {
    return {
      status: false,
      pesan: "Tidak Dapat Menemukan Email",
    };
  }
  try {
    const response = await api.post(ApiEndpoint.Forgot_Password, user);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
  }
};

export const UpdatePassword = async (password: string) => {
  try {
    const response = await api.post(ApiEndpoint.Update_Password, password);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      status: false,
      pesan: "Network error",
    };
  }
};
