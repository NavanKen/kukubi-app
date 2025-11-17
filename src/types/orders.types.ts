export interface IOrders {
  id: string;
  user_id?: string;
  guest_identifier?: string;
  customer_name: string;
  order_type: string;
  status: string;
  total_amount: number;
  order_code: string;
  created_at?: Date;
  updated_at?: Date;
}
