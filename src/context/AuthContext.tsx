import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth.types';
import { authApi } from '@/api/auth.api';
import { decodeToken, isTokenExpired, tokenUtils } from '@/utils/token.utils';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the user session from localStorage when the app first loads
  useEffect(() => {
    const token = tokenUtils.get();
    if (token && !isTokenExpired(token)) {
      setUser(decodeToken(token));
    } else {
      // Token is missing or expired — clear it so we start fresh
      tokenUtils.clear();
    }
    setIsLoading(false);
  }, []);

  // Send login credentials to the backend and save the returned JWT token
  async function login(data: LoginRequest) {
    const { token } = await authApi.login(data);
    tokenUtils.set(token); // Save JWT token after login
    setUser(decodeToken(token));
  }

  // Create a new account and save the returned JWT token
  async function register(data: RegisterRequest) {
    const { token } = await authApi.register(data);
    tokenUtils.set(token); // Save JWT token after registration
    setUser(decodeToken(token));
  }

  // Remove the token from storage and clear the logged-in user
  function logout() {
    tokenUtils.clear();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
