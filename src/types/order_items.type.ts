import type { IProduk } from "./produk.type";

export interface IOrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price: number;
  status?: "pending" | "ready";
  products?: IProduk;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateOrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface ICartItem {
  id?: number;
  product: IProduk;
  quantity: number;
}
