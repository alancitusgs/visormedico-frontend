import type { User } from './auth.types';

export type UserRole = User['role'];

export interface ManagedUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserCreatePayload {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
