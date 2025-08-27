import { User } from "@supabase/supabase-js";

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  confirm_password?: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  avatar: string;
  bio?: string | null;
  address?: string | null;
  phone?: string | null;
  role: string;
  is_online: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  last_login_at?: string | null;
}

export interface IUserResponse {
  status: boolean | null;
  pesan?: string;
  data?: {
    auth: User;
    profile: IUserProfile;
  };
}

export interface IUser {
  name: string;
  email?: string;
  avatar: string;
}
