import type { Page } from '@/types/common.types';
import type { BookResponse } from '@/types/book.types';
import client from './client';

export const booksApi = {
  getBooks: (page = 0, size = 12, signal?: AbortSignal): Promise<Page<BookResponse>> =>
    client
      .get<Page<BookResponse>>('/books', { params: { page, size, sort: 'title' }, signal })
      .then((res) => res.data),
};
