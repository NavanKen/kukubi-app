import { IProduk } from "./produk.type";

export interface ICart {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  products?: IProduk;
}

export interface ICreateCart {
  user_id: string;
  product_id: number;
  quantity: number;
}
