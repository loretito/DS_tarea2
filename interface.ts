export type Status = 'RECEIVED' | 'PREPARED' | 'DELIVERED' | 'COMPLETE';

export interface ProductData {
  id?: number;
  name: string;
  price: number;
  email: string;
  status?: Status;
}
