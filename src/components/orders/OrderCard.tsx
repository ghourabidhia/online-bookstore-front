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

interface Props {
  order: OrderResponse;
}

export function OrderCard({ order }: Props) {
  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="card border-0 shadow-sm mb-4">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="card-header bg-white d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
        <div className="d-flex align-items-center gap-3">
          <span className="fw-bold fs-6">Order #{order.id}</span>
          <span className="text-muted small">{formatOrderDate(order.orderDate)}</span>
        </div>
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
          Confirmed
        </span>
      </div>

      {/* ── Items table ────────────────────────────────────── */}
      <div className="card-body py-2 px-3">
        <div className="table-responsive">
          <table className="table table-sm table-borderless align-middle mb-0">
            <thead>
              <tr className="border-bottom">
                <th className="ps-0 fw-normal text-muted" style={{ fontSize: '0.8rem' }}>
                  Book
                </th>
                <th
                  className="fw-normal text-muted text-center"
                  style={{ width: 64, fontSize: '0.8rem' }}
                >
                  Qty
                </th>
                <th className="fw-normal text-muted" style={{ width: 110, fontSize: '0.8rem' }}>
                  Unit price
                </th>
                <th
                  className="fw-normal text-muted text-end pe-0"
                  style={{ width: 110, fontSize: '0.8rem' }}
                >
                  Line total
                </th>
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
                  <td className="text-muted small">{formatPrice(item.price)}</td>
                  <td className="text-end pe-0 fw-semibold">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="card-footer bg-white border-top d-flex align-items-center justify-content-between py-3 px-3">
        <span className="text-muted small">
          {totalQty}&nbsp;{totalQty === 1 ? 'item' : 'items'}
        </span>
        <div>
          <span className="text-muted small me-2">Total</span>
          <span className="fw-bold text-primary fs-6">{formatPrice(order.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
