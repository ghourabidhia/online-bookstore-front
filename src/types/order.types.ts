export interface OrderItemResponse {
  bookTitle: string;
  quantity: number;
  price: number; // unit price captured at purchase time
}

export interface OrderResponse {
  id: number;
  totalPrice: number;
  orderDate: string; // ISO-8601 LocalDateTime from backend
  items: OrderItemResponse[];
}
