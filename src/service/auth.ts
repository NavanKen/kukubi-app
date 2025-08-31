import { ILogin, IRegister, IUserResponse } from "@/types/auth.type";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const login = async (payload: ILogin) => {
  try {
    const response = await api.post("/login", payload);
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
    const response = await api.post("/register", payload);
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
    const response = await api.get("/profile");
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
    const response = await api.post("/logout");
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
