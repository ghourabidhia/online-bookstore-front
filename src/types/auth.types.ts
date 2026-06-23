export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

/** Decoded JWT payload produced by the backend's JwtService. */
export interface AuthUser {
  sub: string; // email — backend sets subject = user.getUsername() = email
  iat: number;
  exp: number;
}
