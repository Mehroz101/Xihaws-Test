export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Site {
  id: number;
  title: string;
  siteUrl: string;
  category: string;
  coverImage?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}
