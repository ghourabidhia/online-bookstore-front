import { formatPrice } from '@/utils/format.utils';

interface Props {
  totalPrice: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummary({ totalPrice, itemCount, onCheckout }: Props) {
  return (
    <div className="card border-0 shadow-sm" style={{ position: 'sticky', top: '1rem' }}>
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3">Order Summary</h5>

        <div className="d-flex justify-content-between mb-1 text-muted small">
          <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="d-flex justify-content-between mb-1 text-muted small">
          <span>Shipping</span>
          <span className="text-success">Free</span>
        </div>

        <hr className="my-3" />

        <div className="d-flex justify-content-between fw-bold mb-4">
          <span>Total</span>
          <span className="text-primary fs-5">{formatPrice(totalPrice)}</span>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          onClick={onCheckout}
          disabled={itemCount === 0}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
