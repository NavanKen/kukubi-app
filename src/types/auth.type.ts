export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  confirm_password?: string;
}
