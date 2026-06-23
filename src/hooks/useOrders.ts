import { useEffect, useState } from 'react';
import { ordersApi } from '@/api/orders.api';
import type { OrderResponse } from '@/types/order.types';

interface UseOrdersResult {
  orders: OrderResponse[];
  isLoading: boolean;
  error: string | null;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all orders from the backend when the orders page opens
  useEffect(() => {
    ordersApi
      .getOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load your orders.'))
      .finally(() => setIsLoading(false));
  }, []);

  return { orders, isLoading, error };
}
