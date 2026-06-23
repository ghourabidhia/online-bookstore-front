import { useNavigate } from 'react-router-dom';
import { OrderCard } from '@/components/orders/OrderCard';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Spinner } from '@/components/common/Spinner';
import { useOrders } from '@/hooks/useOrders';

export function OrdersPage() {
  const { orders, isLoading, error } = useOrders();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 fw-bold mb-0">My Orders</h1>
        {orders.length > 0 && (
          <span className="text-muted small">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      {!error && orders.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3 text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
            </svg>
          </div>
          <p className="text-muted mb-3">You haven't placed any orders yet.</p>
          <button className="btn btn-primary px-4" onClick={() => navigate('/books')}>
            Browse books
          </button>
        </div>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
