import { useState } from 'react';
import type { BookResponse } from '@/types/book.types';
import { formatPrice } from '@/utils/format.utils';

const GRADIENTS: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#30cfd0', '#330867'],
  ['#f77062', '#fe5196'],
  ['#c471f5', '#fa71cd'],
  ['#0ba360', '#3cba92'],
  ['#e0c3fc', '#8ec5fc'],
  ['#96fbc4', '#f9f586'],
];

interface Props {
  book: BookResponse;
  onAddToCart?: (book: BookResponse) => Promise<void>;
}

export function BookCard({ book, onAddToCart }: Props) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const [from, to] = GRADIENTS[book.id % GRADIENTS.length];

  const outOfStock = book.stock === 0;

  const handleAdd = async () => {
    if (!onAddToCart || adding || outOfStock) return;
    setAdding(true);
    try {
      await onAddToCart(book);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // error surfaced by BooksPage
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm overflow-hidden book-card">
      {/* Static gradient cover */}
      <div
        className="position-relative"
        style={{
          background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)`,
          height: 210,
        }}
      >
        {/* Spine */}
        <div
          className="position-absolute top-0 start-0 bottom-0"
          style={{ width: 12, background: 'rgba(0,0,0,0.18)' }}
        />

        {/* Large initial */}
        <div className="d-flex align-items-center justify-content-center h-100">
          <span
            style={{
              fontSize: '5rem',
              fontWeight: 800,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 4px 16px rgba(0,0,0,0.25)',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {book.title.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Author strip */}
        <div
          className="position-absolute bottom-0 start-0 end-0 px-3 py-2"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)' }}
        >
          <p
            className="mb-0 text-white text-truncate"
            style={{ fontSize: '0.68rem', letterSpacing: '0.05em', opacity: 0.9 }}
          >
            {book.author.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="card-body d-flex flex-column px-3 py-3">
        <h6
          className="card-title fw-bold mb-1 lh-sm"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          title={book.title}
        >
          {book.title}
        </h6>

        <p className="text-muted mb-3" style={{ fontSize: '0.82rem' }}>
          {book.author}
        </p>

        <div className="mt-auto d-flex align-items-center justify-content-between gap-2">
          <span className="fw-bold text-dark fs-6">{formatPrice(book.price)}</span>

          <button
            className={`btn btn-sm px-3 ${
              outOfStock ? 'btn-secondary' : added ? 'btn-success' : 'btn-primary'
            }`}
            onClick={handleAdd}
            disabled={!onAddToCart || adding || outOfStock}
            style={{ minWidth: 80, transition: 'background-color 0.2s' }}
            title={outOfStock ? 'Out of stock' : undefined}
          >
            {adding ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : outOfStock ? (
              'Out of Stock'
            ) : added ? (
              'Added!'
            ) : (
              '+ Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
