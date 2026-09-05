export interface CaptchaResponse {
  captcha: string;
  hash: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  captcha: string;
  captchaHash: string;
}

export interface User {
  id: number | string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
