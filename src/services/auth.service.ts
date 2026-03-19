import { http } from './http';
import type { LoginRequest, LoginResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  async validateToken(): Promise<User> {
    const { data } = await http.get<{ user: User }>('/auth/validate-token');
    return data.user;
  },
};
