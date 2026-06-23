import type { OrderResponse } from '@/types/order.types';
import client from './client';

export const ordersApi = {
  /** POST /api/orders — no request body; backend reads the caller's cart. */
  createOrder: (): Promise<OrderResponse> =>
    client.post<OrderResponse>('/orders').then((res) => res.data),

  /** GET /api/orders — returns all orders for the authenticated user, newest first. */
  getOrders: (): Promise<OrderResponse[]> =>
    client.get<OrderResponse[]>('/orders').then((res) => res.data),
};
