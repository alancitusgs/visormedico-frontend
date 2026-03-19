import { http } from './http';
import type { Study, StudyWithUrls, SlideProperties } from '@/types';

export const studiesService = {
  async getStudies(): Promise<Study[]> {
    const { data } = await http.get<Study[]>('/admin/images');
    return data;
  },

  async getViewerImages(): Promise<StudyWithUrls[]> {
    const { data } = await http.get<StudyWithUrls[]>('/viewer/images');
    return data;
  },

  async deleteStudy(id: number): Promise<void> {
    await http.delete(`/admin/images/${id}`);
  },

  async checkImageStatus(id: number): Promise<{ dzi_ready: boolean; dzi_path: string | null }> {
    const { data } = await http.get<{ dzi_ready: boolean; dzi_path: string | null }>(`/viewer/image/${id}/status`);
    return data;
  },

  async getSlideProperties(stem: string): Promise<SlideProperties> {
    const { data } = await http.get<SlideProperties>(`/tiles/${stem}/properties`);
    return data;
  },

  async uploadDicom(
    formData: FormData,
    onProgress?: (percent: number) => void,
  ): Promise<{ message: string; image?: { id: number } }> {
    const { data } = await http.post<{ message: string; image?: { id: number } }>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30 * 60 * 1000, // 30 minutes for large files
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
    return data;
  },
};
