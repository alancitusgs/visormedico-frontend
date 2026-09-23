import { http } from './http';
import type { DashboardStats, ActivityItem, VisitStats } from '@/types';

export const statsService = {
  async getDashboard(): Promise<DashboardStats> {
    const { data } = await http.get<DashboardStats>('/admin/stats');
    return data;
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    const { data } = await http.get<ActivityItem[]>('/admin/stats/activity');
    return data;
  },

  async getVisits(days = 30): Promise<VisitStats> {
    const { data } = await http.get<VisitStats>('/admin/stats/visits', { params: { days } });
    return data;
  },
};
