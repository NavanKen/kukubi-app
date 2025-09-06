export interface IPengeluaran {
  id?: string;
  name?: string;
  amount: number;
  description?: string;
  user_id?: string;
  date?: Date;
}

export interface IEditPengeluaran {
  data: IPengeluaran;
}
