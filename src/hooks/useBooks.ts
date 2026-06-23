import { useCallback, useEffect, useState } from 'react';
import type { BookResponse } from '@/types/book.types';
import { booksApi } from '@/api/books.api';

interface UseBooksResult {
  books: BookResponse[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  retry: () => void;
}

export function useBooks(pageSize = 12): UseBooksResult {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Incrementing this counter re-triggers the useEffect below (used by the Retry button)
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Load books from the backend when the page opens, or when the user changes page / retries
  useEffect(() => {
    // AbortController lets us cancel the in-flight request if the user navigates away
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    booksApi
      .getBooks(currentPage, pageSize, controller.signal)
      .then((data) => {
        setBooks(data.content);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        // Ignore cancellation errors — they just mean the user left the page
        const name = (err as { name?: string }).name;
        if (name !== 'CanceledError' && name !== 'AbortError') {
          setError('Failed to load books. Please try again.');
          setIsLoading(false);
        }
      });

    // Cancel the request when the component unmounts or the effect re-runs
    return () => controller.abort();
  }, [currentPage, pageSize, fetchTrigger]);

  // Bump the counter to reload books (called when the user clicks Retry)
  const retry = useCallback(() => setFetchTrigger((n) => n + 1), []);

  return { books, totalPages, currentPage, isLoading, error, setPage: setCurrentPage, retry };
}
