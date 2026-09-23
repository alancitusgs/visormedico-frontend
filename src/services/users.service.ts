import { http } from './http';
import type { ManagedUser, UserCreatePayload, UserUpdatePayload } from '@/types';

interface UserMutationResponse {
  message: string;
  user: ManagedUser;
}

export const usersService = {
  async getUsers(): Promise<ManagedUser[]> {
    const { data } = await http.get<ManagedUser[]>('/admin/users');
    return data;
  },

  async createUser(payload: UserCreatePayload): Promise<ManagedUser> {
    const { data } = await http.post<UserMutationResponse>('/admin/users', payload);
    return data.user;
  },

  async updateUser(payload: UserUpdatePayload): Promise<ManagedUser> {
    const { data } = await http.put<UserMutationResponse>('/admin/users', payload);
    return data.user;
  },

  async deleteUser(id: number): Promise<void> {
    await http.delete('/admin/users', { data: { id } });
  },
};
