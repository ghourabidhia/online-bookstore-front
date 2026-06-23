import { useNavigate } from 'react-router-dom';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Spinner } from '@/components/common/Spinner';
import { useCart } from '@/context/CartContext';

export function CartPage() {
  const { cart, isLoading, error, itemCount, updateItem, removeItem, clearError } = useCart();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    <div className="container">
      <h1 className="h3 fw-bold mb-4">Shopping Cart</h1>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={clearError}
        />
      )}

      {!error && (!cart || cart.items.length === 0) ? (
        <div className="text-center py-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            fill="currentColor"
            className="text-muted mb-3"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
          <p className="text-muted mb-3">Your cart is empty.</p>
          <button className="btn btn-primary px-4" onClick={() => navigate('/books')}>
            Browse books
          </button>
        </div>
      ) : (
        cart && (
          <div className="row g-4">
            {/* Cart lines */}
            <div className="col-lg-8">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Summary sidebar */}
            <div className="col-lg-4">
              <CartSummary
                totalPrice={cart.totalPrice}
                itemCount={itemCount}
                onCheckout={() => navigate('/checkout')}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
