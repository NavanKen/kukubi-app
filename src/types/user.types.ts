export interface IUserAdmin {
  id?: string;
  name?: string;
  role?: "user" | "admin" | "cashier";
  password?: string;
  email?: string;
}

export interface IEditUserAdmin {
  data: IUserAdmin;
}

export type UserInformation = {
  name: string;
  code: string;
  type: "guest" | "registered";
  // order_type: "" | "";
};
