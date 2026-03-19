import { http } from './http';
import type { CorsDomain } from '@/types';

export const corsService = {
  async getDomains(): Promise<CorsDomain[]> {
    const { data } = await http.get<CorsDomain[]>('/admin/cors');
    return data;
  },

  async addDomain(domain: string, desc: string): Promise<CorsDomain> {
    const { data } = await http.post<CorsDomain>('/admin/cors', { domain, desc });
    return data;
  },

  async updateDomain(domain: string, updates: { desc?: string; status?: string }): Promise<CorsDomain> {
    const { data } = await http.put<CorsDomain>(`/admin/cors/${encodeURIComponent(domain)}`, updates);
    return data;
  },

  async deleteDomain(domain: string): Promise<void> {
    await http.delete(`/admin/cors/${encodeURIComponent(domain)}`);
  },

  async verifyDomain(domain: string): Promise<{ allowed: boolean }> {
    const { data } = await http.get<{ allowed: boolean }>(`/admin/cors/verify?domain=${encodeURIComponent(domain)}`);
    return data;
  },
};
