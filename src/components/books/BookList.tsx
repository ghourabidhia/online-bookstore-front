import type { BookResponse } from '@/types/book.types';
import { BookCard } from './BookCard';

interface Props {
  books: BookResponse[];
  onAddToCart?: (book: BookResponse) => Promise<void>;
}

export function BookList({ books, onAddToCart }: Props) {
  if (books.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-0">No books available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
      {books.map((book) => (
        <div key={book.id} className="col">
          <BookCard book={book} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}
