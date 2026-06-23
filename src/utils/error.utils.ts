import { isAxiosError } from 'axios';

// Get a readable error message from a failed API call.
// The backend sends errors in two formats:
//   1. { message: "..." }  — for business errors and 404s
//   2. { fieldName: "error message", ... }  — for invalid form input
export function extractErrorMessage(
  err: unknown,
  fallback = 'An unexpected error occurred.'
): string {
  if (!isAxiosError(err) || !err.response?.data) return fallback;

  const { data } = err.response;

  // Show backend error message if there is one
  if (typeof data.message === 'string') return data.message;

  // Show backend error message
  if (typeof data === 'object') {
    const messages = Object.values(data).filter((v): v is string => typeof v === 'string');
    if (messages.length) return messages.join('. ');
  }

  return fallback;
}
