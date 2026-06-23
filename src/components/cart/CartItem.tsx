import { useState } from 'react';
import type { CartItemResponse } from '@/types/cart.types';
import { extractErrorMessage } from '@/utils/error.utils';
import { formatPrice } from '@/utils/format.utils';

interface Props {
  item: CartItemResponse;
  onUpdate: (id: number, quantity: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

export function CartItem({ item, onUpdate, onRemove }: Props) {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = updating || removing;
  const lineTotal = item.price * item.quantity;

  const handleQtyChange = async (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1 || busy) return;
    setError(null);
    setUpdating(true);
    try {
      await onUpdate(item.id, newQty);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update quantity.'));
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (busy) return;
    setError(null);
    setRemoving(true);
    try {
      await onRemove(item.id);
      // component unmounts on success — no need to reset state
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not remove item.'));
      setRemoving(false);
    }
  };

  return (
    <div
      className={`card border-0 shadow-sm mb-3 transition ${removing ? 'opacity-50' : ''}`}
      aria-busy={busy}
    >
      <div className="card-body py-3">
        <div className="row align-items-center gy-2">

          {/* Book info */}
          <div className="col-12 col-md-5">
            <p className="fw-semibold mb-0">{item.bookTitle}</p>
            <span className="text-muted small">{formatPrice(item.price)} / unit</span>
          </div>

          {/* Quantity stepper */}
          <div className="col-auto col-md-3">
            <div className="input-group input-group-sm" style={{ width: 116 }}>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => handleQtyChange(-1)}
                disabled={busy || item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="form-control text-center bg-white d-flex align-items-center justify-content-center px-0">
                {updating ? (
                  <span className="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true" />
                ) : (
                  item.quantity
                )}
              </span>

              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => handleQtyChange(1)}
                disabled={busy}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Line total */}
          <div className="col col-md-2 text-end text-md-start">
            <span className="fw-bold">{formatPrice(lineTotal)}</span>
          </div>

          {/* Remove button */}
          <div className="col-auto col-md-2 text-end">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemove}
              disabled={busy}
              aria-label={`Remove ${item.bookTitle} from cart`}
            >
              {removing ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              ) : (
                'Remove'
              )}
            </button>
          </div>
        </div>

        {/* Per-item error */}
        {error && (
          <div className="alert alert-danger py-1 px-2 mb-0 mt-2 small" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
