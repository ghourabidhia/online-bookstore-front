import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import type { OrderResponse } from '@/types/order.types';
import { formatPrice } from '@/utils/format.utils';

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-BE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Order confirmation page.
 * Receives the OrderResponse via React Router navigation state set by CheckoutPage.
 * Redirects to /orders if accessed directly (no state available).
 */
export function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = (location.state as { order?: OrderResponse } | null)?.order ?? null;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="container">
      {/* ── Confirmation banner ─────────────────────────────── */}
      <div className="text-center py-4 mb-2">
        <div
          className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3"
          style={{ width: 64, height: 64 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="white"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        </div>
        <h1 className="h3 fw-bold mb-1">Order confirmed!</h1>
        <p className="text-muted mb-0">
          Order&nbsp;
          <span className="fw-semibold text-dark">#{order.id}</span>
          &nbsp;&mdash;&nbsp;{formatOrderDate(order.orderDate)}
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* ── Order details card ───────────────────────────── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Order details</h5>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                Confirmed
              </span>
            </div>

            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr className="border-bottom">
                      <th className="ps-0 fw-normal text-muted">Book</th>
                      <th className="fw-normal text-muted text-center">Qty</th>
                      <th className="fw-normal text-muted">Unit price</th>
                      <th className="fw-normal text-muted text-end pe-0">Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="ps-0 fw-semibold">{item.bookTitle}</td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border px-2 py-1">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="text-muted">{formatPrice(item.price)}</td>
                        <td className="text-end pe-0 fw-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-top">
                      <td colSpan={3} className="ps-0 fw-bold pt-3">
                        Total ({totalQty} {totalQty === 1 ? 'item' : 'items'})
                      </td>
                      <td className="text-end pe-0 fw-bold text-primary fs-6 pt-3">
                        {formatPrice(order.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* ── Actions ──────────────────────────────────────── */}
          <div className="d-flex gap-3 justify-content-center">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate('/orders')}
            >
              My Orders
            </button>
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate('/books')}
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
