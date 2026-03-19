import { http } from './http';
import type { Course, CourseDetail } from '@/types';

export const coursesService = {
  async getCourses(): Promise<Course[]> {
    const { data } = await http.get<Course[]>('/admin/courses');
    return data;
  },

  async getCourse(id: number): Promise<CourseDetail> {
    const { data } = await http.get<CourseDetail>(`/admin/courses/${id}`);
    return data;
  },

  async createCourse(course: { name: string; period_id?: number | null; color: string }): Promise<Course> {
    const { data } = await http.post<Course>('/admin/courses', course);
    return data;
  },

  async updateCourse(id: number, course: { name?: string; period_id?: number | null; color?: string }): Promise<Course> {
    const { data } = await http.put<Course>(`/admin/courses/${id}`, course);
    return data;
  },

  async deleteCourse(id: number): Promise<void> {
    await http.delete(`/admin/courses/${id}`);
  },
};
