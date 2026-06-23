import type {
  AddCartItemRequest,
  CartResponse,
  UpdateCartItemRequest,
} from '@/types/cart.types';
import client from './client';

export const cartApi = {
  getCart: (): Promise<CartResponse> =>
    client.get<CartResponse>('/cart').then((res) => res.data),

  addItem: (data: AddCartItemRequest): Promise<void> =>
    client.post('/cart/items', data).then(() => undefined),

  updateItem: (itemId: number, data: UpdateCartItemRequest): Promise<void> =>
    client.put(`/cart/items/${itemId}`, data).then(() => undefined),

  removeItem: (itemId: number): Promise<void> =>
    client.delete(`/cart/items/${itemId}`).then(() => undefined),
};
