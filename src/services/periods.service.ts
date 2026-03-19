import { http } from './http';
import type { Period } from '@/types';

export const periodsService = {
  async getPeriods(): Promise<Period[]> {
    const { data } = await http.get<Period[]>('/admin/periods');
    return data;
  },

  async createPeriod(name: string): Promise<Period> {
    const { data } = await http.post<Period>('/admin/periods', { name });
    return data;
  },

  async updatePeriod(id: number, name: string): Promise<Period> {
    const { data } = await http.put<Period>(`/admin/periods/${id}`, { name });
    return data;
  },

  async deletePeriod(id: number): Promise<void> {
    await http.delete(`/admin/periods/${id}`);
  },
};
