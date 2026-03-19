import { http } from './http';
import type { Collection, CollectionDetail } from '@/types';

export const collectionsService = {
  async getCollections(): Promise<Collection[]> {
    const { data } = await http.get<Collection[]>('/admin/collections');
    return data;
  },

  async getCollection(id: number): Promise<CollectionDetail> {
    const { data } = await http.get<CollectionDetail>(`/admin/collections/${id}`);
    return data;
  },

  async createCollection(body: { name: string; course_id?: number | null }): Promise<Collection> {
    const { data } = await http.post<Collection>('/admin/collections', body);
    return data;
  },

  async updateCollection(id: number, body: { name?: string; course_id?: number | null }): Promise<Collection> {
    const { data } = await http.put<Collection>(`/admin/collections/${id}`, body);
    return data;
  },

  async deleteCollection(id: number): Promise<void> {
    await http.delete(`/admin/collections/${id}`);
  },

  async addImages(collectionId: number, imageIds: number[]): Promise<Collection> {
    const { data } = await http.post<Collection>(`/admin/collections/${collectionId}/images`, { image_ids: imageIds });
    return data;
  },

  async removeImage(collectionId: number, imageId: number): Promise<void> {
    await http.delete(`/admin/collections/${collectionId}/images/${imageId}`);
  },
};
