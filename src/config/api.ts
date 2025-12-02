import axios from "axios";

export const AuthApi = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const MidtransApi = axios.create({
  baseURL: "/api/midtrans",
  withCredentials: true,
});
