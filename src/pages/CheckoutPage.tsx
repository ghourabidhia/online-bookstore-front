import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@/api/orders.api';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Spinner } from '@/components/common/Spinner';
import { useCart } from '@/context/CartContext';
import { extractErrorMessage } from '@/utils/error.utils';
import { formatPrice } from '@/utils/format.utils';

export function CheckoutPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = !isLoading && (!cart || cart.items.length === 0);

  // Redirect to cart if the user lands here with an empty cart
  useEffect(() => {
    if (isEmpty) navigate('/cart', { replace: true });
  }, [isEmpty, navigate]);

  if (isLoading || isEmpty) return <Spinner />;

  const handlePlaceOrder = async () => {
    setError(null);
    setPlacing(true);
    try {
      const order = await ordersApi.createOrder();
      await refreshCart(); // backend cleared the cart — sync local state
      navigate(`/orders/${order.id}`, { replace: true, state: { order } });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not place your order. Please try again.'));
      setPlacing(false);
    }
  };

  return (
    <div className="container">
      <h1 className="h3 fw-bold mb-4">Checkout</h1>

      <div className="row g-4">
        {/* ── Order summary ───────────────────────────────────── */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
              <h5 className="fw-bold mb-0">Order summary</h5>
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
                    {cart!.items.map((item) => (
                      <tr key={item.id}>
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
                        Total
                      </td>
                      <td className="text-end pe-0 fw-bold text-primary fs-6 pt-3">
                        {formatPrice(cart!.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment panel ───────────────────────────────────── */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm"
            style={{ position: 'sticky', top: '1rem' }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Payment</h5>

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>
                  Subtotal ({cart!.items.length}{' '}
                  {cart!.items.length === 1 ? 'item' : 'items'})
                </span>
                <span>{formatPrice(cart!.totalPrice)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Shipping</span>
                <span className="text-success fw-semibold">Free</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between fw-bold mb-4">
                <span>Total</span>
                <span className="text-primary fs-5">{formatPrice(cart!.totalPrice)}</span>
              </div>

              {error && (
                <div className="mb-3">
                  <ErrorAlert message={error} />
                </div>
              )}

              <button
                className="btn btn-primary w-100 py-2"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Placing order…
                  </>
                ) : (
                  'Place order'
                )}
              </button>

              <button
                className="btn btn-link w-100 text-muted mt-1 text-decoration-none small"
                onClick={() => navigate('/cart')}
                disabled={placing}
              >
                Back to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
