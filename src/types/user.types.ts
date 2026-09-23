import type { User } from './auth.types';

export type UserRole = User['role'];

export interface ManagedUser {
  id: number;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  id: number;
  email?: string;
  password?: string;
  role?: UserRole;
}
