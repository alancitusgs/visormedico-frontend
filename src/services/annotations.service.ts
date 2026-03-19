import { http } from './http';
import type { AnnotationData } from '@/types/annotation.types';

interface CreateAnnotationBody {
  type: string;
  points: { x: number; y: number }[];
  color: string;
  stroke_width: number;
  label?: string | null;
}

export const annotationsService = {
  async getAnnotations(imageId: number): Promise<AnnotationData[]> {
    const { data } = await http.get<AnnotationData[]>(`/annotations/${imageId}`);
    return data;
  },

  async createAnnotation(imageId: number, body: CreateAnnotationBody): Promise<AnnotationData> {
    const { data } = await http.post<AnnotationData>(`/annotations/${imageId}`, body);
    return data;
  },

  async deleteAnnotation(annotationId: number): Promise<void> {
    await http.delete(`/annotations/${annotationId}`);
  },

  async clearAnnotations(imageId: number): Promise<void> {
    await http.delete(`/annotations/image/${imageId}`);
  },
};
