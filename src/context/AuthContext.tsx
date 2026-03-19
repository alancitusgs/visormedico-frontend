import { createContext, useState, useEffect, useCallback } from 'react';
import type { FC, PropsWithChildren } from 'react';
import type { AuthState } from '@/types';
import { authService } from '@/services/auth.service';

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Al montar, valida el token contra el backend real
  useEffect(() => {
    const token = localStorage.getItem('visumed_token');
    if (token) {
      authService
        .validateToken()
        .then((user) => {
          setState({ user, token, isAuthenticated: true, isLoading: false });
        })
        .catch(() => {
          localStorage.removeItem('visumed_token');
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    localStorage.setItem('visumed_token', response.token);
    setState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('visumed_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
