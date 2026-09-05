import React, { createContext, useContext, useEffect, useCallback, useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import type { User, AuthState, LoginPayload, LoginResponse, CaptchaResponse } from '@/types/auth';

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  logout: () => void;
  getCaptcha: () => Promise<CaptchaResponse>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, removeUser] = useLocalStorage<User | null>('admin_user', null);
  const [token, setToken, removeToken] = useLocalStorage<string | null>('admin_token', null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Listen for logout events (e.g., from 401 errors)
  useEffect(() => {
    const handleLogout = () => {
      removeUser();
      removeToken();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [removeUser, removeToken]);

  // Initial auth check - validate token with /api/auth/me/
  useEffect(() => {
    const validateSession = async () => {
      if (token) {
        try {
          const userData = await apiFetch<User>(API_ENDPOINTS.me, { token });
          setUser(userData);
        } catch {
          // Token invalid, clear session
          removeUser();
          removeToken();
        }
      }
      setIsLoading(false);
    };
    validateSession();
  }, []);

  const getCaptcha = useCallback(async (): Promise<CaptchaResponse> => {
    return apiFetch<CaptchaResponse>(API_ENDPOINTS.captcha);
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiFetch<LoginResponse>(API_ENDPOINTS.login, {
      method: 'POST',
      body: {
        identifier: payload.identifier,
        password: payload.password,
        captcha: payload.captcha,
        captcha_hash: payload.captchaHash,
      },
    });

    if (response.token) {
      setToken(response.token);
      setUser(response.user);
    }

    return response;
  }, [setToken, setUser]);

  const logout = useCallback(() => {
    removeUser();
    removeToken();
  }, [removeUser, removeToken]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getCaptcha,
  }), [user, token, isAuthenticated, isLoading, login, logout, getCaptcha]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
