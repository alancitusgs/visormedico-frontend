import { http } from './http';
import type { DashboardStats, ActivityItem } from '@/types';

export const statsService = {
  async getDashboard(): Promise<DashboardStats> {
    const { data } = await http.get<DashboardStats>('/admin/stats');
    return data;
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    const { data } = await http.get<ActivityItem[]>('/admin/stats/activity');
    return data;
  },
};
