import type { AuthUser } from '@/types/auth.types';

const TOKEN_KEY = 'token';

// Helpers to read, save, and delete the JWT token in localStorage
export const tokenUtils = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token); },
  clear: (): void => { localStorage.removeItem(TOKEN_KEY); },
};

// Read the user info stored inside a JWT token (the middle part, base64-encoded)
export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as AuthUser;
  } catch {
    return null;
  }
}

// Check whether a JWT token has passed its expiry date
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return Date.now() / 1000 > decoded.exp;
}
