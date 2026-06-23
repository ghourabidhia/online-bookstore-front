export interface CartItemResponse {
  id: number;
  bookTitle: string;
  quantity: number;
  price: number; // unit price per book — line total = price * quantity
}

export interface CartResponse {
  items: CartItemResponse[];
  totalPrice: number; // server-calculated sum
}

export interface AddCartItemRequest {
  bookId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
