export interface IProduk {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

export interface ICreateProduk extends IProduk {
  file?: File | null;
}

export interface IEditProduk {
  data: ICreateProduk;
}
