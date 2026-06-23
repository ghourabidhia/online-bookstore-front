import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types';
import client from './client';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    client.post<AuthResponse>('/auth/login', data).then((res) => res.data),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    client.post<AuthResponse>('/auth/register', data).then((res) => res.data),
};
