export interface IReview {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  review: string | null;
  created_at?: Date;
  updated_at?: Date;
  users?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ICreateReview {
  product_id: number;
  user_id: string;
  rating: number;
  review?: string;
}
