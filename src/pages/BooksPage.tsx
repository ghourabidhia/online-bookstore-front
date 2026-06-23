import { useState } from 'react';
import { BookList } from '@/components/books/BookList';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Pagination } from '@/components/common/Pagination';
import { Spinner } from '@/components/common/Spinner';
import { useCart } from '@/context/CartContext';
import { useBooks } from '@/hooks/useBooks';
import type { BookResponse } from '@/types/book.types';
import { extractErrorMessage } from '@/utils/error.utils';

export function BooksPage() {
  const { books, totalPages, currentPage, isLoading, error, setPage, retry } = useBooks(12);
  const { addItem } = useCart();
  const [cartError, setCartError] = useState<string | null>(null);

  // Add selected book to cart, then show an error banner if it fails
  const handleAddToCart = async (book: BookResponse): Promise<void> => {
    setCartError(null);
    try {
      await addItem(book.id, 1);
    } catch (err) {
      // Show backend error message
      setCartError(extractErrorMessage(err, 'Could not add book to cart.'));
      throw err; // re-throw so BookCard transitions to its error state
    }
  };

  return (
    <div className="container">
      <h1 className="h3 fw-bold mb-4">Our Books</h1>

      {/* Cart operation error — dismissible */}
      {cartError && (
        <div className="alert alert-warning alert-dismissible py-2 mb-4" role="alert">
          {cartError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setCartError(null)}
            aria-label="Close"
          />
        </div>
      )}

      {isLoading && <Spinner />}
      {error && <ErrorAlert message={error} onRetry={retry} />}

      {!isLoading && !error && (
        <>
          <BookList books={books} onAddToCart={handleAddToCart} />

          {totalPages > 1 && (
            <div className="mt-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
