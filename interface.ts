export type Status = 'RECEIVED' | 'PREPARED' | 'DELIVERED' | 'COMPLETE';

export interface ProductData {
  bd_id?: number;
  name: string;
  price: number;
  email: string;
  status?: Status;
}
